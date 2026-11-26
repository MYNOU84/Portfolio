<#
    Shrinks the website images so the site can actually be uploaded.

    The photos in public\projects are camera originals - 5184 x 3456 pixels,
    up to 18 MB each. A web page never needs more than about 2000 pixels.

    What this does, for every .jpg and .png under public\ :
      1. moves the ORIGINAL file into _originals_full_size\  (nothing is deleted)
      2. writes a resized copy back in its place, same name, same folder

    public\hero is skipped on purpose - the approved hero image is never touched.

    Run it again any time: files already shrunk are skipped.
#>

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$MaxDim  = 2000   # longest side, in pixels
$Quality = 82     # JPEG quality

$root   = Split-Path $PSScriptRoot -Parent
$public = Join-Path $root 'public'
$backup = Join-Path $root '_originals_full_size'

if (-not (Test-Path $public)) { throw "public folder not found at $public" }
if (-not (Test-Path $backup)) { New-Item -ItemType Directory -Path $backup | Out-Null }

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
             Where-Object { $_.MimeType -eq 'image/jpeg' }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality, [int]$Quality)

# EXIF orientation tag - browsers honour it, so we must bake it in before stripping it
$ORIENT = 274
$rotations = @{
    2 = 'RotateNoneFlipX'; 3 = 'Rotate180FlipNone'; 4 = 'Rotate180FlipX'
    5 = 'Rotate90FlipX';   6 = 'Rotate90FlipNone';  7 = 'Rotate270FlipX'
    8 = 'Rotate270FlipNone'
}

$files = Get-ChildItem $public -Recurse -File -Include *.jpg,*.jpeg,*.png |
         Where-Object { $_.FullName -notlike (Join-Path $public 'hero\*') }

$before = ($files | Measure-Object Length -Sum).Sum
$done = 0; $skipped = 0; $failed = @()
$sw = [Diagnostics.Stopwatch]::StartNew()

Write-Host ("Found {0} images, {1:N0} MB. Shrinking to max {2}px..." -f $files.Count, ($before/1MB), $MaxDim)

foreach ($f in $files) {
    $rel = $f.FullName.Substring($public.Length).TrimStart('\')
    $dest = Join-Path $backup $rel

    if (Test-Path $dest) { $skipped++; continue }   # already processed on an earlier run

    $src = $null; $bmp = $null; $g = $null
    try {
        $src = [System.Drawing.Image]::FromFile($f.FullName)

        if ($src.PropertyIdList -contains $ORIENT) {
            $code = $src.GetPropertyItem($ORIENT).Value[0]
            if ($rotations.ContainsKey([int]$code)) { $src.RotateFlip($rotations[[int]$code]) }
        }

        $ratio = [Math]::Min($MaxDim / $src.Width, $MaxDim / $src.Height)
        if ($ratio -ge 1 -and $f.Length -lt 400KB) {
            $src.Dispose(); $src = $null; $skipped++; continue   # already small enough
        }
        if ($ratio -gt 1) { $ratio = 1 }

        $nw = [int][Math]::Round($src.Width  * $ratio)
        $nh = [int][Math]::Round($src.Height * $ratio)

        $bmp = New-Object System.Drawing.Bitmap($nw, $nh)
        $bmp.SetResolution(72, 72)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode   = 'HighQualityBicubic'
        $g.SmoothingMode       = 'HighQuality'
        $g.PixelOffsetMode     = 'HighQuality'
        $g.CompositingQuality  = 'HighQuality'
        $g.DrawImage($src, 0, 0, $nw, $nh)
        $g.Dispose(); $g = $null
        $src.Dispose(); $src = $null      # release the file lock before moving it

        New-Item -ItemType Directory -Path (Split-Path $dest -Parent) -Force | Out-Null
        Move-Item -LiteralPath $f.FullName -Destination $dest

        if ($f.Extension -ieq '.png') {
            $bmp.Save($f.FullName, [System.Drawing.Imaging.ImageFormat]::Png)
        } else {
            $bmp.Save($f.FullName, $jpegCodec, $encParams)
        }
        $bmp.Dispose(); $bmp = $null
        $done++
    }
    catch {
        $failed += "$rel  ->  $($_.Exception.Message)"
        if (-not (Test-Path $f.FullName) -and (Test-Path $dest)) { Move-Item -LiteralPath $dest -Destination $f.FullName }
    }
    finally {
        if ($g)   { $g.Dispose() }
        if ($bmp) { $bmp.Dispose() }
        if ($src) { $src.Dispose() }
    }

    if ((($done + $skipped) % 50) -eq 0) {
        Write-Host ("  {0} / {1}" -f ($done + $skipped), $files.Count)
    }
}

$sw.Stop()
$after = (Get-ChildItem $public -Recurse -File -Include *.jpg,*.jpeg,*.png |
          Measure-Object Length -Sum).Sum

Write-Host ""
Write-Host ("Shrunk  : {0} images" -f $done)
Write-Host ("Skipped : {0} (already small, or done on an earlier run)" -f $skipped)
Write-Host ("Before  : {0:N0} MB" -f ($before/1MB))
Write-Host ("After   : {0:N0} MB" -f ($after/1MB))
Write-Host ("Saved   : {0:N0} MB   in {1:N0} min" -f (($before-$after)/1MB), $sw.Elapsed.TotalMinutes)
Write-Host ("Originals kept in: {0}" -f $backup)

if ($failed.Count) {
    Write-Host ""
    Write-Host ("{0} file(s) failed:" -f $failed.Count) -ForegroundColor Yellow
    $failed | ForEach-Object { Write-Host "  $_" -ForegroundColor Yellow }
}
