<#
    Second pass: the PNG files are still huge.

    PNG is the wrong format for photographs and renders - it stores them without
    any compression, so a 2000px render is 5 MB as PNG and 250 KB as JPEG.

    This converts every PNG that does NOT use transparency into a JPEG, deletes
    the PNG, and then updates every place on the site that pointed at the old
    .png name so nothing breaks.

    PNGs that really use transparency (logos, cut-outs) are left alone.
    public\hero is skipped - the approved hero image is never touched.
#>

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$Quality = 86

$root   = Split-Path $PSScriptRoot -Parent
$public = Join-Path $root 'public'
$src    = Join-Path $root 'src'

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
             Where-Object { $_.MimeType -eq 'image/jpeg' }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality, [int]$Quality)

# True if the image actually uses transparency anywhere (not just "has an alpha channel")
function Test-RealTransparency([System.Drawing.Image]$img) {
    if (-not [System.Drawing.Image]::IsAlphaPixelFormat($img.PixelFormat)) { return $false }
    $probe = New-Object System.Drawing.Bitmap(64, 64, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($probe)
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($img, 0, 0, 64, 64)
    $g.Dispose()
    $transparent = $false
    for ($y = 0; $y -lt 64 -and -not $transparent; $y++) {
        for ($x = 0; $x -lt 64; $x++) {
            if ($probe.GetPixel($x, $y).A -lt 250) { $transparent = $true; break }
        }
    }
    $probe.Dispose()
    return $transparent
}

$pngs = Get-ChildItem $public -Recurse -File -Filter *.png |
        Where-Object { $_.FullName -notlike (Join-Path $public 'hero\*') }

$before = ($pngs | Measure-Object Length -Sum).Sum
Write-Host ("Checking {0} PNG files, {1:N0} MB..." -f $pngs.Count, ($before/1MB))

$renamed = @{}          # old file name -> new file name
$kept = 0; $converted = 0; $failed = @()
$n = 0

foreach ($p in $pngs) {
    $n++
    $img = $null; $bmp = $null; $g = $null
    try {
        $img = [System.Drawing.Image]::FromFile($p.FullName)
        if (Test-RealTransparency $img) { $img.Dispose(); $img = $null; $kept++; continue }

        $w = $img.Width; $h = $img.Height
        $bmp = New-Object System.Drawing.Bitmap($w, $h)
        $bmp.SetResolution(72, 72)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.Clear([System.Drawing.Color]::White)      # flatten onto white, JPEG has no alpha
        $g.DrawImage($img, 0, 0, $w, $h)
        $g.Dispose(); $g = $null
        $img.Dispose(); $img = $null

        $jpgPath = [IO.Path]::ChangeExtension($p.FullName, '.jpg')
        $bmp.Save($jpgPath, $jpegCodec, $encParams)
        $bmp.Dispose(); $bmp = $null

        Remove-Item -LiteralPath $p.FullName -Force
        $renamed[$p.Name] = [IO.Path]::GetFileName($jpgPath)
        $converted++
    }
    catch { $failed += "$($p.Name)  ->  $($_.Exception.Message)" }
    finally {
        if ($g)   { $g.Dispose() }
        if ($bmp) { $bmp.Dispose() }
        if ($img) { $img.Dispose() }
    }
    if (($n % 25) -eq 0) { Write-Host ("  {0} / {1}" -f $n, $pngs.Count) }
}

Write-Host ""
Write-Host "Updating the links that pointed at the old .png names..."

$textFiles = @()
$textFiles += Get-ChildItem $src -Recurse -File -Include *.js,*.jsx
$textFiles += Get-ChildItem $public -Recurse -File -Include *.html,*.css,*.js
$textFiles += Get-ChildItem $root -File -Include *.html

$touched = 0
foreach ($t in $textFiles) {
    $text = [IO.File]::ReadAllText($t.FullName)
    $orig = $text
    foreach ($old in $renamed.Keys) {
        if ($text.Contains($old)) { $text = $text.Replace($old, $renamed[$old]) }
    }
    if ($text -ne $orig) { [IO.File]::WriteAllText($t.FullName, $text); $touched++ }
}

# projects.js builds some file names with a helper: imgs('Folder', 92, 'png').
# If that folder has no PNG left, the helper must now ask for jpg.
$dataFile = Join-Path $src 'data\projects.js'
if (Test-Path $dataFile) {
    $text = [IO.File]::ReadAllText($dataFile)
    $orig = $text
    foreach ($m in [regex]::Matches($text, "imgs\('([^']+)',\s*(\d+),\s*'png'\)")) {
        $folder = Join-Path $public ('projects\' + $m.Groups[1].Value)
        if (Test-Path $folder) {
            $left = @(Get-ChildItem $folder -File -Filter *.png -ErrorAction SilentlyContinue).Count
            if ($left -eq 0) { $text = $text.Replace($m.Value, $m.Value.Replace("'png')", "'jpg')")) }
        }
    }
    if ($text -ne $orig) { [IO.File]::WriteAllText($dataFile, $text); $touched++; Write-Host "  fixed the image list in src\data\projects.js" }
}

$after = (Get-ChildItem $public -Recurse -File -Filter *.png |
          Measure-Object Length -Sum).Sum
$total = (Get-ChildItem $public -Recurse -File | Measure-Object Length -Sum).Sum

Write-Host ""
Write-Host ("Converted to JPEG : {0}" -f $converted)
Write-Host ("Kept as PNG       : {0}  (they really use transparency)" -f $kept)
Write-Host ("Files relinked    : {0}" -f $touched)
Write-Host ("PNG before        : {0:N0} MB" -f ($before/1MB))
Write-Host ("PNG after         : {0:N0} MB" -f ($after/1MB))
Write-Host ("public folder now : {0:N0} MB" -f ($total/1MB))

if ($failed.Count) {
    Write-Host ""
    Write-Host ("{0} file(s) failed:" -f $failed.Count) -ForegroundColor Yellow
    $failed | ForEach-Object { Write-Host "  $_" -ForegroundColor Yellow }
}
