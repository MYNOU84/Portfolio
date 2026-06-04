const KEY       = 'portfolio-custom-projects'
const ORDER_KEY = 'portfolio-project-order'

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
