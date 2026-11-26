#!/usr/bin/env node
/**
 * Resets the portfolio admin passphrase.
 *
 *   npm run admin:passphrase
 *
 * Asks for the new passphrase twice without echoing it, then writes only its SHA-256 digest into
 * src/App.jsx (ADMIN_HASH). The passphrase is never printed, logged or saved. Rebuild and deploy afterwards.
 *
 * The admin gate is checked in the browser, and the digest ships in the public bundle, so use a long,
 * unique passphrase (at least 16 characters, ideally 4+ random words) that you use nowhere else.
 */
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const APP = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'App.jsx')
const LINE = /const ADMIN_HASH = '[0-9a-f]{64}'/
const MIN = 16

function ask(prompt) {
  return new Promise((resolve, reject) => {
    const { stdin, stdout } = process
    if (!stdin.isTTY) { console.error('Run this in an interactive terminal. Nothing changed.'); process.exit(1) }
    stdout.write(prompt)
    stdin.setRawMode(true)
    stdin.resume()
    stdin.setEncoding('utf8')
    let value = ''
    const onData = (chunk) => {
      for (const ch of chunk) {
        if (ch === '\r' || ch === '\n') {
          stdin.setRawMode(false); stdin.pause(); stdin.off('data', onData); stdout.write('\n')
          resolve(value); return
        }
        if (ch === '\u0003') { stdin.setRawMode(false); stdout.write('\n'); process.exit(130) }
        if (ch === '\u007f' || ch === '\b') value = value.slice(0, -1)
        else value += ch
      }
    }
    stdin.on('data', onData)
  })
}

const source = readFileSync(APP, 'utf8')
if (!LINE.test(source)) { console.error('ADMIN_HASH line not found in src/App.jsx; nothing changed.'); process.exit(1) }

const first = await ask('New admin passphrase: ')
if (first.length < MIN) { console.error(`Use at least ${MIN} characters. Nothing changed.`); process.exit(1) }
const second = await ask('Repeat it: ')
if (first !== second) { console.error('The two entries differ. Nothing changed.'); process.exit(1) }

const digest = createHash('sha256').update(first, 'utf8').digest('hex')
writeFileSync(APP, source.replace(LINE, `const ADMIN_HASH = '${digest}'`))
console.log('Admin passphrase updated in src/App.jsx. Run "npm run build", commit and deploy for it to take effect.')
