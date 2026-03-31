import api from './api'

export const watchlistService = {
  getAll: () => api.get('/watchlist').then(r => r.data),
  add: (item) => api.post('/watchlist', item).then(r => r.data),
  remove: (tmdbId) => api.delete(`/watchlist/${tmdbId}`).then(r => r.data),
  check: (tmdbId) => api.get(`/watchlist/check/${tmdbId}`).then(r => r.data),
}

export const downloadsService = {
  getAll: () => api.get('/downloads').then(r => r.data),
  add: (item) => api.post('/downloads', item).then(r => r.data),
  remove: (tmdbId) => api.delete(`/downloads/${tmdbId}`).then(r => r.data),
}
