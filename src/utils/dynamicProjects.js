const KEY        = 'portfolio-custom-projects'
const ORDER_KEY  = 'portfolio-project-order'
const HIDDEN_KEY = 'portfolio-hidden-projects'

export function loadDynamicProjects() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

export function saveDynamicProject(project) {
  const all = loadDynamicProjects()
  const i = all.findIndex(p => p.id === project.id)
  if (i >= 0) all[i] = project; else all.unshift(project)
  localStorage.setItem(KEY, JSON.stringify(all))
}

export function deleteDynamicProject(id) {
  const all = loadDynamicProjects().filter(p => p.id !== id)
  localStorage.setItem(KEY, JSON.stringify(all))
}

export function loadProjectOrder() {
  try { return JSON.parse(localStorage.getItem(ORDER_KEY) || 'null') } catch { return null }
}

export function saveProjectOrder(ids) {
  localStorage.setItem(ORDER_KEY, JSON.stringify(ids))
}

export function clearProjectOrder() {
  localStorage.removeItem(ORDER_KEY)
}

// ── Built-in project overrides (title, description, etc.) ───
const OVERRIDES_KEY = 'portfolio-project-overrides'

export function loadProjectOverrides() {
  try { return JSON.parse(localStorage.getItem(OVERRIDES_KEY) || '{}') } catch { return {} }
}

export function saveProjectOverride(id, fields) {
  const all = loadProjectOverrides()
  all[id] = { ...all[id], ...fields }
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(all))
}

export function clearProjectOverride(id) {
  const all = loadProjectOverrides()
  delete all[id]
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(all))
}

// ── Hidden projects (built-in only) ─────────────────────────
export function loadHiddenProjects() {
  try { return JSON.parse(localStorage.getItem(HIDDEN_KEY) || '[]') } catch { return [] }
}

export function toggleHiddenProject(id) {
  const hidden = loadHiddenProjects()
  const idx = hidden.indexOf(id)
  if (idx >= 0) hidden.splice(idx, 1); else hidden.push(id)
  localStorage.setItem(HIDDEN_KEY, JSON.stringify(hidden))
  return [...hidden]
}
