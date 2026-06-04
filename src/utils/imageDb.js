const DB = 'portfolio-img-db'
const STORE = 'imgs'

function openDb() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1)
    r.onupgradeneeded = () => r.result.createObjectStore(STORE)
    r.onsuccess = () => res(r.result)
    r.onerror = () => rej(r.error)
  })
}

export async function storeBlob(key, blob) {
  const db = await openDb()
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(blob, key)
    tx.oncomplete = res
    tx.onerror = () => rej(tx.error)
  })
}

export async function getBlobUrl(key) {
  const db = await openDb()
  return new Promise((res, rej) => {
    const r = db.transaction(STORE, 'readonly').objectStore(STORE).get(key)
    r.onsuccess = () => res(r.result ? URL.createObjectURL(r.result) : null)
    r.onerror = () => rej(r.error)
  })
}

export async function deleteProjectBlobs(projectId) {
  const db = await openDb()
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)
    const r = store.getAllKeys()
    r.onsuccess = () => {
      r.result
        .filter(k => String(k).startsWith(projectId + '/'))
        .forEach(k => store.delete(k))
    }
    tx.oncomplete = res
    tx.onerror = () => rej(tx.error)
  })
}
