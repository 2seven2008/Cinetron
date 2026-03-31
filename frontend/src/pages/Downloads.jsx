import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Trash2 } from 'lucide-react'
import { downloadsService } from '../services/watchlist'
import { useAuth } from '../context/AuthContext'
import { showToast, SkeletonGrid } from '../components/UI'

export default function Downloads() {
  const nav = useNavigate()
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('todos')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!user) { nav('/login'); return }
    downloadsService.getAll()
      .then(setItems)
      .catch(() => showToast('Erro ao carregar downloads', 'error'))
      .finally(() => setLoading(false))
  }, [user])

  const remove = async (tmdbId, e) => {
    e.stopPropagation()
    try {
      await downloadsService.remove(tmdbId)
      setItems(prev => prev.filter(i => i.tmdbId !== tmdbId))
      showToast('Download removido', 'info')
    } catch { showToast('Erro ao remover', 'error') }
  }

  const filtered = items.filter(i => {
    const matchFilter = filter === 'todos' || i.mediaType === (filter === 'filmes' ? 'movie' : 'tv')
    const matchSearch = !search || i.title.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="page fade-up">
      <div className="page-header">
        <h1 className="page-title">Downloads</h1>
        <p className="page-subtitle">{items.length} itens instalados</p>
      </div>

      <div className="filter-tabs">
        {['todos', 'filmes', 'series'].map(f => (
          <button key={f} className={`filter-tab ${filter === f ? 'filter-tab--active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'todos' ? '≡ Todos' : f === 'filmes' ? 'Filmes' : 'Séries'}
          </button>
        ))}
      </div>

      <div className="list-search">
        <Search size={16} className="search-icon" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar em Downloads" />
      </div>

      {loading && <SkeletonGrid count={4} />}

      {!loading && filtered.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">⬇️</span>
          <h3>Sem downloads ainda</h3>
          <p>Adicione conteúdo para assistir offline</p>
          <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => nav('/buscar')}>
            Explorar conteúdo
          </button>
        </div>
      )}

      {!loading && (
        <div className="grid-2">
          {filtered.map(item => (
            <div
              key={item._id}
              className="list-card"
              onClick={() => nav(`/${item.mediaType === 'tv' ? 'serie' : 'filme'}/${item.tmdbId}`)}
            >
              <div className="list-card__img">
                {item.posterPath
                  ? <img src={`https://image.tmdb.org/t/p/w342${item.posterPath}`} alt={item.title} loading="lazy" />
                  : <div className="list-card__placeholder">{item.title.charAt(0)}</div>
                }
                <button className="list-card__remove" onClick={e => remove(item.tmdbId, e)}>
                  <Trash2 size={14} />
                </button>
              </div>
              <p className="list-card__title">{item.title}</p>
              <p className="list-card__type">{item.mediaType === 'tv' ? 'Série · 5 Episódios' : 'Filme'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
