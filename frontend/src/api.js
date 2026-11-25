const IMG = 'https://image.tmdb.org/t/p'

export const img = (path, size = 'w500') => (path ? `${IMG}/${size}${path}` : null)

async function get(url) {
  const res = await fetch(url)
  if (!res.ok) {
    let msg = `요청 실패 (${res.status})`
    try {
      msg = (await res.json()).detail || msg
    } catch {}
    throw new Error(msg)
  }
  return res.json()
}

export const api = {
  home: () => get('/api/home'),
  category: (type) => get(`/api/category/${type}`),
  detail: (type, id) => get(`/api/${type}/${id}`),
  search: (q, page = 1) => get(`/api/search?q=${encodeURIComponent(q)}&page=${page}`),
}
