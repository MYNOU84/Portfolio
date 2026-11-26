/*
 * The build runs with emptyOutDir: false, so dist/ keeps the large copied image
 * tree between builds instead of re-copying it every time. The side effect is
 * that every previous JS/CSS bundle also stays behind and would be uploaded on
 * the next deploy. This removes the bundles that dist/index.html no longer
 * references. Nothing outside dist/assets is touched.
 */
import { readFileSync, readdirSync, unlinkSync, statSync, existsSync } from 'node:fs'
import path from 'node:path'

const dist = path.resolve('dist')
const assets = path.join(dist, 'assets')
const indexHtml = path.join(dist, 'index.html')

if (!existsSync(assets) || !existsSync(indexHtml)) process.exit(0)

const html = readFileSync(indexHtml, 'utf8')
const referenced = new Set(
  [...html.matchAll(/assets\/([A-Za-z0-9_.\-]+)/g)].map((m) => m[1])
)

let removed = 0
let bytes = 0
for (const name of readdirSync(assets)) {
  if (referenced.has(name)) continue
  const file = path.join(assets, name)
  bytes += statSync(file).size
  unlinkSync(file)
  removed++
}

if (removed) {
  console.log(`pruned ${removed} stale bundle(s) from dist/assets (${(bytes / 1048576).toFixed(1)} MB)`)
}
