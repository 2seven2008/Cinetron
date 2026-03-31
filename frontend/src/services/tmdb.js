import axios from 'axios'

// TMDB API - Free tier
// Get your key at: https://www.themoviedb.org/settings/api (free, no credit card)
const TMDB_KEY = import.meta.env.VITE_TMDB_KEY || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZW1vIiwic3ViIjoiZGVtbyJ9.demo'
const TMDB_BASE = 'https://api.themoviedb.org/3'
export const TMDB_IMG = 'https://image.tmdb.org/t/p'

const tmdb = axios.create({
  baseURL: TMDB_BASE,
  params: { language: 'pt-BR', api_key: import.meta.env.VITE_TMDB_API_KEY },
  headers: import.meta.env.VITE_TMDB_KEY
    ? { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` }
    : {},
  timeout: 8000,
})

// Helper
const get = (path, params = {}) => tmdb.get(path, { params }).then(r => r.data)

export const tmdbService = {
  // Home
  trending: (type = 'all', time = 'week') => get(`/trending/${type}/${time}`),
  popular: (type = 'movie') => get(`/${type}/popular`),
  topRated: (type = 'movie') => get(`/${type}/top_rated`),
  nowPlaying: () => get('/movie/now_playing'),
  airingToday: () => get('/tv/airing_today'),
  onAir: () => get('/tv/on_the_air'),

  // Search
  search: (query, page = 1) => get('/search/multi', { query, page }),
  searchMovies: (query) => get('/search/movie', { query }),
  searchTV: (query) => get('/search/tv', { query }),

  // Details
  movieDetail: (id) => get(`/movie/${id}`, { append_to_response: 'credits,videos,similar,recommendations' }),
  tvDetail: (id) => get(`/tv/${id}`, { append_to_response: 'credits,videos,similar,recommendations' }),
  season: (tvId, seasonNum) => get(`/tv/${tvId}/season/${seasonNum}`),

  // Genres
  genres: (type = 'movie') => get(`/genre/${type}/list`),
  byGenre: (type, genreId, page = 1) => get(`/discover/${type}`, { with_genres: genreId, sort_by: 'popularity.desc', page }),

  // Images
  poster: (path, size = 'w342') => path ? `${TMDB_IMG}/${size}${path}` : null,
  backdrop: (path, size = 'w1280') => path ? `${TMDB_IMG}/${size}${path}` : null,
  profile: (path, size = 'w185') => path ? `${TMDB_IMG}/${size}${path}` : null,
}

export default tmdbService
