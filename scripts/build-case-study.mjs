/*
 * Builds Session 2 — Applied Case Studies, CS-01 Chapter 01, from a private
 * Markdown source that is never committed (pass its path as the argument).
 * The text is converted unabridged; the only changes are the anonymization
 * replacements a–d below. Output is refused if any forbidden term (read from
 * the ignored file private/forbidden-terms.txt, one per line) remains.
 *
 * The parser and inline formatting are the same as scripts/build-healthcare.mjs.
 *
 *   node scripts/build-case-study.mjs private/<source>.md
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import assert from 'node:assert'
import path from 'node:path'

const SRC = process.argv[2]
assert(SRC && existsSync(SRC), 'usage: node scripts/build-case-study.mjs <source.md>')
const TERMS_FILE = 'private/forbidden-terms.txt'
assert(existsSync(TERMS_FILE), `${TERMS_FILE} is required`)
const FORBIDDEN = readFileSync(TERMS_FILE, 'utf8').split(/\r?\n/).map((t) => t.trim()).filter(Boolean)
assert(FORBIDDEN.length > 0, `${TERMS_FILE} is empty`)
const HA = 'public/healthcare-architecture'
const CS_ROOT = path.join(HA, 'case-studies')
const CS_DIR = path.join(CS_ROOT, 'cs-01-maternity-children')

// ── Anonymization: the only text changes (a–d); each must apply exactly once ──
let text = readFileSync(SRC, 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n')
function replaceOnce(re, to, label) {
  const hits = text.match(new RegExp(re.source, re.flags + 'g')) || []
  assert.strictEqual(hits.length, 1, `replacement ${label}: expected 1 match, found ${hits.length}`)
  text = text.replace(re, to)
}
replaceOnce(/في مشروع [A-Za-z][A-Za-z ]*[A-Za-z] بأبوظبي، الذي تبلغ سعته الإجمالية المعلنة \d+ سريراً،/,
  'في مستشفى نساء وحديثي ولادة نموذجي بأبوظبي، ضمن نطاق اختصاص DoH،', 'a (§1.1)')
replaceOnce(/في مشروع [A-Za-z][A-Za-z ]*[A-Za-z](?=،)/, 'في منشأة من هذا النوع', 'b (§1.29)')
replaceOnce(/^Project: .*$/m, "Case Study: CS-01 — Maternity & Children's Hospital, Abu Dhabi (DoH)", 'c (Project)')
replaceOnce(/^Status: .*$/m, 'Status: Published — Rev. 01', 'd (Status)')
replaceOnce(/^Purpose: .*$/m, 'Purpose: Independent educational case study', 'd (Purpose)')
assert((text.match(/المالك/g) || []).length >= 3, '"المالك" must be kept in §1.22 and §1.27')

const findForbidden = (s) => FORBIDDEN.filter((t) => s.toLowerCase().includes(t.toLowerCase()))
assert.deepStrictEqual(findForbidden(text), [], 'forbidden terms remain in the converted text')

// ── Inline formatting and bidi isolation (as in build-healthcare.mjs) ──
const ARABIC = /[؀-ۿ]/
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const L = 'A-Za-zÀ-ÖØ-öø-ÿŒœ'
const LATIN_RUN = new RegExp(`[${L}][${L}0-9 '’\u0001/.,:+°↔\\-–—?]*[${L}0-9?]|[${L}]`, 'g')
const FRENCH = /[éèêàçôûœ]|\b(Hygiène|Projet|Schéma|Cahier|Programmation|Bloc|Salle|Clinique|Forum|Et si)\b/

const isolate = (s) =>
  s.replace(/&amp;/g, '\u0001')
    .replace(LATIN_RUN, (run) => `<span dir="ltr" lang="${FRENCH.test(run) ? 'fr' : 'en'}">${run}</span>`)
    .replace(/\u0001/g, '&amp;')

function inline(raw) {
  const held = []
  const hold = (html) => `\u0000${held.push(html) - 1}\u0000`
  let s = esc(raw)
  s = s.replace(/`([^`]+)`/g, (_, c) => hold(`<code dir="ltr">${c}</code>`))
  s = s.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, (_, t, u) =>
    hold(`<a href="${u}" target="_blank" rel="noopener" dir="ltr">${t}</a>`))
  s = s.replace(/https?:\/\/[^\s<\u0000]+/g, (u) =>
    hold(`<a class="url" href="${u}" target="_blank" rel="noopener" dir="ltr">${u}</a>`))
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/\*(.+?)\*/g, '<em>$1</em>')
  s = s.split(/(<[^>]+>|\u0000\d+\u0000)/).map((p) => (p.startsWith('<') || p.startsWith('\u0000') ? p : isolate(p))).join('')
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => held[i])
}
const dirAttr = (raw) => (ARABIC.test(raw) ? '' : ' dir="ltr"')

// ── Anchor ids: numbered headings → s1-4-3, unnumbered sub-headings by name ──
const SUB_IDS = {
  '1.3|متطلبات المراجعة في مرحلة التنفيذ': 's1-3-review',
  '1.5|العلاقات الحرجة': 's1-5-critical',
  '1.5|العلاقات القريبة': 's1-5-adjacent',
  '1.5|تنظيم مداخل القسم': 's1-5-entrances',
  '1.16|درجات الحرارة': 's1-16-temperatures',
  '1.16|متطلبات التنسيق': 's1-16-coordination',
  '1.17|متطلبات مراجعة الرسومات': 's1-17-drawing-review',
  '1.18|متطلبات المراجعة': 's1-18-review',
  '1.19|أحواض غسل اليدين': 's1-19-handwash',
  '1.19|غرف العزل': 's1-19-isolation',
  '1.19|النفايات السريرية': 's1-19-clinical-waste',
  '1.20|حماية المواليد': 's1-20-infant-protection',
  '1.23|المكونات المرجعية': 's1-23-components',
  '1.23|المتطلبات الوظيفية': 's1-23-functional',
  '1.23|زمن النقل': 's1-23-transfer-time',
}
const NAMED_IDS = { 'المراجع — References': 'references' }
function headingId(text, section) {
  const num = text.match(/^(\d+(?:\.\d+)+)\s/)
  if (num) return 's' + num[1].replace(/\./g, '-')
  if (NAMED_IDS[text]) return NAMED_IDS[text]
  const sub = SUB_IDS[`${section}|${text}`]
  if (sub) return sub
  throw new Error(`no anchor id for heading: ${text}`)
}

// ── Block parser (as in build-healthcare.mjs) ──
function parse(src) {
  const blocks = []
  let i = 0
  const isBlockStart = (l) => /^(#{1,6} |\||> ?|>$|- |\d+\. |\$\$|---$)/.test(l)
  while (i < src.length) {
    const line = src[i]
    if (!line.trim()) { i++; continue }
    if (line.trim() === '---') { blocks.push({ t: 'hr' }); i++; continue }
    let m
    if ((m = line.match(/^(#{1,6}) (.+)$/))) { blocks.push({ t: 'h', level: m[1].length, text: m[2].trim() }); i++; continue }
    if (line.trim() === '$$') {
      const tex = []
      i++
      while (src[i].trim() !== '$$') tex.push(src[i++])
      i++
      blocks.push({ t: 'math', tex: tex.join('\n').trim() })
      continue
    }
    if (line.startsWith('|')) {
      const rows = []
      while (i < src.length && src[i].startsWith('|')) rows.push(src[i++])
      const cells = (r) => r.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim())
      blocks.push({ t: 'table', head: cells(rows[0]), body: rows.slice(2).map(cells) })
      continue
    }
    if (line.startsWith('>')) {
      const q = []
      while (i < src.length && src[i].startsWith('>')) q.push(src[i++].replace(/^> ?/, ''))
      blocks.push({ t: 'quote', lines: q })
      continue
    }
    if (line.startsWith('- [ ] ')) {
      const items = []
      while (i < src.length && src[i].startsWith('- [ ] ')) items.push(src[i++].slice(6))
      blocks.push({ t: 'check', items })
      continue
    }
    if (line.startsWith('- ')) {
      const items = []
      while (i < src.length && src[i].startsWith('- ')) items.push(src[i++].slice(2))
      blocks.push({ t: 'ul', items })
      continue
    }
    if (/^\d+\. /.test(line)) {
      const items = []
      while (i < src.length && /^\d+\. /.test(src[i])) items.push(src[i++].replace(/^\d+\. /, ''))
      blocks.push({ t: 'ol', items })
      continue
    }
    const para = []
    while (i < src.length && src[i].trim() && !isBlockStart(src[i])) para.push(src[i++])
    blocks.push({ t: 'p', lines: para })
  }
  return blocks
}

const paraHtml = (ls) => ls.map((l) => inline(l.replace(/ {2,}$/, ''))).join('<br>\n')

function render(b) {
  switch (b.t) {
    case 'hr': return '<hr>'
    case 'h': return `<h${b.level} id="${b.id}"><a class="anchor" href="#${b.id}" aria-hidden="true" tabindex="-1">#</a>${inline(b.text)}</h${b.level}>`
    case 'p': { const raw = b.lines.join(' '); return `<p${dirAttr(raw)}>${paraHtml(b.lines)}</p>` }
    case 'math':
      return `<div class="math" dir="ltr" data-tex="${esc(b.tex)}"><code class="tex-fallback">${esc(b.tex)}</code></div>`
    case 'table': {
      const th = b.head.map((c) => `<th${dirAttr(c)}>${inline(c)}</th>`).join('')
      const tr = b.body.map((r) => `<tr>${r.map((c) => `<td${dirAttr(c)}>${inline(c)}</td>`).join('')}</tr>`).join('\n')
      return `<div class="table-wrap" role="region" tabindex="0" aria-label="${esc(b.head.join(' · '))}"><table><thead><tr>${th}</tr></thead><tbody>\n${tr}\n</tbody></table></div>`
    }
    case 'quote': {
      const paras = []
      let cur = []
      for (const l of b.lines) { if (l.trim()) cur.push(l); else if (cur.length) { paras.push(cur); cur = [] } }
      if (cur.length) paras.push(cur)
      return `<blockquote${dirAttr(b.lines.join(' '))}>${paras.map((p) => `<p>${paraHtml(p)}</p>`).join('')}</blockquote>`
    }
    case 'ul': return `<ul>${b.items.map((x) => `<li${dirAttr(x)}>${inline(x)}</li>`).join('')}</ul>`
    case 'ol': return `<ol>${b.items.map((x) => `<li${dirAttr(x)}>${inline(x)}</li>`).join('')}</ol>`
    case 'check':
      return `<ul class="checklist">${b.items.map((x) => `<li><span class="box" aria-hidden="true"></span><span>${inline(x)}</span></li>`).join('')}</ul>`
  }
}

// ── Chapter page ──
// Source levels: # chapter title, ## revision line, ### sections, #### sub-sections.
// Sections render as <h2> and sub-sections as <h3>, as in Session 1.
const all = parse(text.split('\n'))
const firstSection = all.findIndex((b) => b.t === 'h' && b.level === 3)
const front = all.slice(0, firstSection)
const body = all.slice(firstSection).map((b) => (b.t === 'h' ? { ...b, level: b.level - 1 } : b))

// Ids depend on the enclosing section, so assign them in document order.
const seen = new Set()
let section = ''
for (const b of body) {
  if (b.t !== 'h') continue
  assert(b.level === 2 || b.level === 3, `unexpected heading level: ${b.text}`)
  if (b.level === 2) section = (b.text.match(/^(\d+\.\d+)\s/) || [])[1] || ''
  b.id = headingId(b.text, section)
  assert(!seen.has(b.id), `duplicate id ${b.id}`)
  seen.add(b.id)
}

assert(front.length === 2 && front.every((b) => b.t === 'h'), 'front matter must be the two title headings')
const heroHtml = [
  `<p class="breadcrumb" dir="ltr" lang="en">Case Study CS-01 &nbsp;/&nbsp; Maternity &amp; Children's Hospital, Abu Dhabi (DoH)</p>`,
  `<h1 id="top" dir="ltr" lang="en">${esc(front[0].text)}</h1><div class="rule"></div>`,
  `<p dir="ltr"><strong>${inline(front[1].text)}</strong></p>`,
].join('\n')

const tocItems = []
for (const h of body.filter((b) => b.t === 'h')) {
  const item = { id: h.id, text: h.text, children: [] }
  if (h.level === 2) tocItems.push(item)
  else if (tocItems.length && /^\d/.test(h.text)) tocItems.at(-1).children.push(item)
}
const tocLink = (it) => `<a href="#${it.id}">${inline(it.text)}</a>`
const tocHtml = `<ol>${tocItems.map((it) =>
  `<li>${tocLink(it)}${it.children.length ? `<ol>${it.children.map((c) => `<li>${tocLink(c)}</li>`).join('')}</ol>` : ''}</li>`).join('')}</ol>`

const bodyHtml = []
let open = false
for (const b of body) {
  if (b.t === 'h' && b.level === 2) {
    if (open) bodyHtml.push('</section>')
    bodyHtml.push(`<section aria-labelledby="${b.id}">`)
    open = true
  }
  if (b.t === 'hr') continue
  bodyHtml.push(render(b))
}
if (open) bodyHtml.push('</section>')

// ── Templates ──
const TPL = 'scripts/healthcare-templates'
const template = (name) => readFileSync(path.join(TPL, name), 'utf8')
const fill = (tpl, vars) => tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => { assert(k in vars, `missing ${k}`); return vars[k] })

// The index pages reuse the hub's own style block unchanged, plus the appended case-study rules.
const hubTpl = template('hub.html')
const csStyle = template('cs-shared-style.css').trimEnd()
const csGrid = template('cs-grid.html').trimEnd()
// The hub carries the same grid and rules; stop if they have drifted apart.
assert(hubTpl.includes(fill(csGrid, { base: 'case-studies/' })), 'hub.html case-study grid differs from cs-grid.html')
assert(hubTpl.includes(csStyle), 'hub.html is missing the rules from cs-shared-style.css')
const hubStyle = hubTpl.match(/<style>\n([\s\S]*?)\n<\/style>/)[1].replace(csStyle, '').trimEnd()

const episodes = tocItems.filter((it) => /^\d+\.\d+ /.test(it.text))
assert.strictEqual(episodes.length, 29, `expected 29 episodes, got ${episodes.length}`)
const epCode = (n) => `CS01-E${String(n + 1).padStart(2, '0')}`
const epNum = (it) => it.text.split(' ')[0]
const episodeHtml = episodes.map((it, n) => `<li><a class="ep" href="chapter-01.html#${it.id}">
      <span class="ep-n">${epCode(n)}</span>
      <span class="ep-sec">${epNum(it)}</span>
      <span class="ep-title" lang="ar" dir="rtl">${inline(it.text.split(' ').slice(1).join(' '))}</span>
      <span class="ep-cta" aria-hidden="true">→</span>
    </a></li>`).join('\n')
const figureHtml = episodes.map((it, n) => `    <figure class="fig-ph" id="fig-${it.id}">
      <div class="frame">Image placeholder</div>
      <figcaption><b>${epCode(n)}</b>Section ${epNum(it)} — placeholder, no image yet</figcaption>
    </figure>`).join('\n')

const outputs = {
  [path.join(CS_DIR, 'chapter-01.html')]: fill(template('cs-chapter.html'), { hero: heroHtml, toc: tocHtml, body: bodyHtml.join('\n') }),
  [path.join(CS_DIR, 'index.html')]: fill(template('cs-01.html'), {
    hubStyle, csStyle, episodes: episodeHtml, figures: figureHtml,
    episodeCount: String(episodes.length).padStart(2, '0'),
  }),
  [path.join(CS_ROOT, 'index.html')]: fill(template('cs-index.html'), { hubStyle, csStyle, csGrid: fill(csGrid, { base: '' }) }),
}

// ── Refuse to write anything if a forbidden term made it into the output ──
for (const [file, html] of Object.entries(outputs)) {
  const bad = findForbidden(html)
  assert.deepStrictEqual(bad, [], `forbidden terms in ${file}: ${bad.join(', ')}`)
}
mkdirSync(CS_DIR, { recursive: true })
for (const [file, html] of Object.entries(outputs)) writeFileSync(file, html)
console.log(`case studies: wrote ${Object.keys(outputs).length} pages (${seen.size} headings, ${episodes.length} episodes)`)
