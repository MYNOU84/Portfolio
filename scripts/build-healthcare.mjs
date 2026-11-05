/*
 * Builds the Healthcare Architecture series pages from the approved chapter
 * Markdown in docs/healthcare-architecture/. The chapter text is converted
 * as written (no rewording); the only content removed is the "سجل معالجة
 * مراجعة Claude" table in Appendix A. Output is plain static HTML in
 * public/healthcare-architecture/, so Vite copies it like the other pages.
 *
 *   node scripts/build-healthcare.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import assert from 'node:assert'
import path from 'node:path'

const SRC = 'docs/healthcare-architecture/Healthcare_Architecture_Chapter_01_Draft_02_AR.md'
const OUT = 'public/healthcare-architecture'
const EXCLUDED_HEADING = '### سجل معالجة مراجعة Claude'

// ── Source: drop the excluded review-log table, keep everything else ──
let lines = readFileSync(SRC, 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n').split('\n')
const cut = lines.indexOf(EXCLUDED_HEADING)
assert(cut > 0, 'excluded heading not found')
let end = cut + 1
while (end < lines.length && lines[end].trim() !== '---') end++
lines = [...lines.slice(0, cut), ...lines.slice(end)]
assert(!lines.join('\n').includes('مراجعة Claude'), 'review log still present')

// ── Inline formatting and bidi isolation ──
const ARABIC = /[؀-ۿ]/
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const L = 'A-Za-zÀ-ÖØ-öø-ÿŒœ'
// \u0001 stands in for an escaped "&amp;" so "A & B" stays one run.
const LATIN_RUN = new RegExp(`[${L}][${L}0-9 '’\u0001/.,:+°↔\\-–—?]*[${L}0-9?]|[${L}]`, 'g')
const FRENCH = /[éèêàçôûœ]|\b(Hygiène|Projet|Schéma|Cahier|Programmation|Bloc|Salle|Clinique|Forum|Et si)\b/

// Latin runs inside Arabic text get their own direction so punctuation and
// word order stay correct; French terms are tagged so they get French hyphenation.
const isolate = (text) =>
  text.replace(/&amp;/g, '\u0001')
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

// ── Anchor ids: numbered headings → s1-4-3-1, the rest by name ──
const NAMED_IDS = {
  'المراجع الأساسية': 'references',
  'المراجع المهنية': 'references-professional',
  'المراجع التنظيمية والتخطيطية': 'references-regulatory',
  'مثال حسابي توضيحي': 's1-8-2-example',
  'قائمة التحقق — Clinical Brief Readiness Checklist': 's1-11-checklist',
  'نموذج سجل المتطلبات — Architectural Requirements Register': 's1-11-register',
  'ملحق A — حدود التحقق وملاحظات ما قبل الإتاحة العامة': 'appendix-a',
  'سجل المراجع والمواضع المستخدمة': 'sources-register',
}
const ORDINALS = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن']
function headingId(text) {
  const num = text.match(/^(\d+(?:\.\d+)+)\s/)
  if (num) return 's' + num[1].replace(/\./g, '-')
  if (NAMED_IDS[text]) return NAMED_IDS[text]
  const q = ORDINALS.findIndex((o) => text.startsWith(`السؤال ${o}`))
  if (q >= 0) return `s1-12-q${q + 1}`
  throw new Error(`no anchor id for heading: ${text}`)
}

// ── Block parser for the constructs this document uses ──
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
    case 'h': {
      const id = headingId(b.text)
      return `<h${b.level} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a>${inline(b.text)}</h${b.level}>`
    }
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
const blocks = parse(lines)
const firstHr = blocks.findIndex((b) => b.t === 'hr')
const front = blocks.slice(0, firstHr)
const body = blocks.slice(firstHr + 1)

// Front matter: the first H1 is the series name, the second is the chapter title.
let h1Seen = 0
const heroHtml = front.map((b) => {
  if (b.t === 'h' && b.level === 1) {
    h1Seen++
    return h1Seen === 1 ? `<p class="breadcrumb">${inline(b.text)}</p>` : `<h1 id="top">${inline(b.text)}</h1><div class="rule"></div>`
  }
  return render(b)
}).join('\n')

const headings = body.filter((b) => b.t === 'h' && b.level <= 3)
const tocItems = []
for (const h of headings) {
  const item = { id: headingId(h.text), text: h.text, children: [] }
  if (h.level === 2) tocItems.push(item)
  else if (tocItems.length && /^\d/.test(h.text)) tocItems.at(-1).children.push(item)
}
const tocLink = (it) => `<a href="#${it.id}">${inline(it.text)}</a>`
const tocHtml = `<ol>${tocItems.map((it) =>
  `<li>${tocLink(it)}${it.children.length ? `<ol>${it.children.map((c) => `<li>${tocLink(c)}</li>`).join('')}</ol>` : ''}</li>`).join('')}</ol>`

// Each top-level section (## …) becomes a <section> so it can be styled and observed.
const bodyHtml = []
let open = false
for (const b of body) {
  if (b.t === 'h' && b.level === 2) {
    if (open) bodyHtml.push('</section>')
    bodyHtml.push(`<section aria-labelledby="${headingId(b.text)}">`)
    open = true
  }
  if (b.t === 'hr') continue
  bodyHtml.push(render(b))
}
if (open) bodyHtml.push('</section>')

const template = (name) => readFileSync(path.join('scripts/healthcare-templates', name), 'utf8')
const fill = (tpl, vars) => tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => { assert(k in vars, `missing ${k}`); return vars[k] })

mkdirSync(OUT, { recursive: true })
writeFileSync(path.join(OUT, 'chapter-01.html'), fill(template('chapter.html'), {
  hero: heroHtml,
  toc: tocHtml,
  body: bodyHtml.join('\n'),
}))

// ── Session 1 page: episode list mirrors the chapter's numbered sections ──
const episodes = tocItems.filter((it) => /^\d+\.\d+ /.test(it.text))
const episodeHtml = episodes.map((it, n) => {
  const [num, ...rest] = it.text.split(' ')
  return `<li><a class="ep" href="chapter-01.html#${it.id}">
      <span class="ep-n">E${String(n + 1).padStart(2, '0')}</span>
      <span class="ep-sec">${num}</span>
      <span class="ep-title" lang="ar" dir="rtl">${inline(rest.join(' '))}</span>
      <span class="ep-cta" aria-hidden="true">→</span>
    </a></li>`
}).join('\n')
const episodeCount = String(episodes.length).padStart(2, '0')
writeFileSync(path.join(OUT, 'session-1.html'), fill(template('session-1.html'), { episodes: episodeHtml, episodeCount }))

// ── Hub page: hero + one card per session ──
writeFileSync(path.join(OUT, 'index.html'), fill(template('hub.html'), { episodeCount }))

console.log(`healthcare-architecture: chapter-01.html (${headings.length} headings), session-1.html (${episodes.length} episodes), index.html`)
