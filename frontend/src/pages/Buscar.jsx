import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import tmdbService from '../services/tmdb'
import { MediaCard, SkeletonGrid } from '../components/UI'

const GENRES = [
  { id: 28, name: 'Ação', color: '#FF6B35' },
  { id: 35, name: 'Comédia', color: '#FFD700' },
  { id: 27, name: 'Terror', color: '#8B0000' },
  { id: 18, name: 'Drama', color: '#4169E1' },
  { id: 878, name: 'Ficção Científica', color: '#00CED1' },
  { id: 10749, name: 'Romance', color: '#FF69B4' },
  { id: 16, name: 'Animação', color: '#32CD32' },
  { id: 53, name: 'Suspense', color: '#9400D3' },
  { id: 12, name: 'Aventura', color: '#FF8C00' },
  { id: 14, name: 'Fantasia', color: '#00FA9A' },
]

export default function Buscar() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState(params.get('tab') || 'tudo')
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [genreResults, setGenreResults] = useState([])
  const inputRef = useRef(null)
  const debounce = useRef(null)

  useEffect(() => {
    if (!query) { setSuggestions([]); setResults([]); return }
    clearTimeout(debounce.current)
    debounce.current = setTimeout(() => doSearch(query), 380)
    return () => clearTimeout(debounce.current)
  }, [query])

  const doSearch = async q => {
    setLoading(true)
    try {
      const data = await tmdbService.search(q)
      const res = (data.results || []).filter(r => r.media_type !== 'person')
      setSuggestions(res.slice(0, 4))
      setResults(res)
    } finally { setLoading(false) }
  }

  const selectGenre = async g => {
    setSelectedGenre(g)
    setQuery('')
    setResults([])
    setSuggestions([])
    setLoading(true)
    try {
      const type = tab === 'series' ? 'tv' : 'movie'
      const data = await tmdbService.byGenre(type, g.id)
      setGenreResults(data.results || [])
    } finally { setLoading(false) }
  }

  const goDetail = item => {
    const type = item.media_type === 'tv' || item.first_air_date ? 'serie' : 'filme'
    nav(`/${type}/${item.id}`)
  }

  const clear = () => { setQuery(''); setResults([]); setSuggestions([]); setSelectedGenre(null) }

  const displayResults = query ? results : genreResults
  const showEmpty = !query && !selectedGenre

  return (
    <div className="page page--search fade-up">
      {/* Search bar */}
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar Filmes e Séries..."
          autoComplete="off"
        />
        {query && <button onClick={clear}><X size={16} /></button>}
      </div>

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map(s => (
            <button key={s.id} className="suggestion-item" onClick={() => goDetail(s)}>
              <Search size={14} />
              <span>{s.title || s.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        {['tudo', 'filmes', 'series'].map(t => (
          <button key={t} className={`tab ${tab === t ? 'tab--active' : ''}`} onClick={() => setTab(t)}>
            {t === 'tudo' ? 'Tudo' : t === 'filmes' ? 'Filmes' : 'Séries'}
          </button>
        ))}
      </div>

      {showEmpty && (
        <>
          <div className="search-section">
            <h3 className="search-section-title">Busca Populares</h3>
            <div className="tags">
              {['Comédia', 'Terror', 'Ação', 'Drama', 'Animação'].map(t => (
                <button key={t} className="tag" onClick={() => setQuery(t)}>{t}</button>
              ))}
            </div>
          </div>

          <div className="search-section">
            <h3 className="search-section-title">Busca por Gênero</h3>
            <div className="genres-grid">
              {GENRES.map(g => (
                <button key={g.id} className="genre-card" style={{ '--gc': g.color }} onClick={() => selectGenre(g)}>
                  {g.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {loading && <SkeletonGrid count={6} />}

      {!loading && displayResults.length > 0 && (
        <div className="search-section">
          {selectedGenre && <h3 className="search-section-title">{selectedGenre.name}</h3>}
          <div className="grid-2">
            {displayResults
              .filter(r => {
                if (tab === 'filmes') return !r.first_air_date && r.media_type !== 'tv'
                if (tab === 'series') return !!r.first_air_date || r.media_type === 'tv'
                return true
              })
              .map(item => (
                <MediaCard key={item.id} item={item} size="lg" onClick={() => goDetail(item)} />
              ))}
          </div>
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <div className="empty-state">
          <p>Nenhum resultado para "{query}"</p>
        </div>
      )}
    </div>
  )
}
