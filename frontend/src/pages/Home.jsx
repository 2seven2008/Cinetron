import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import tmdbService from '../services/tmdb'
import { HeroCard, MediaCard, Section, showToast } from '../components/UI'
import { watchlistService } from '../services/watchlist'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const nav = useNavigate()
  const { user } = useAuth()
  const [trending, setTrending] = useState([])
  const [popular, setPopular] = useState([])
  const [topSeries, setTopSeries] = useState([])
  const [nowPlaying, setNowPlaying] = useState([])
  const [hero, setHero] = useState(null)
  const [loadingTrending, setLoadingTrending] = useState(true)
  const [loadingPopular, setLoadingPopular] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [trendData, popData, seriesData, nowData] = await Promise.all([
        tmdbService.trending('all', 'week'),
        tmdbService.popular('movie'),
        tmdbService.topRated('tv'),
        tmdbService.nowPlaying(),
      ])
      const trendResults = trendData.results || []
      setTrending(trendResults)
      setHero(trendResults[0] || null)
      setPopular(popData.results || [])
      setTopSeries(seriesData.results || [])
      setNowPlaying(nowData.results || [])
    } catch (err) {
      console.error('TMDB error:', err)
    } finally {
      setLoadingTrending(false)
      setLoadingPopular(false)
    }
  }

  const goDetail = item => {
    const type = item.media_type === 'tv' || item.first_air_date ? 'serie' : 'filme'
    nav(`/${type}/${item.id}`)
  }

  const addToList = async () => {
    if (!user) { nav('/login'); return }
    if (!hero) return
    try {
      await watchlistService.add({
        tmdbId: hero.id,
        title: hero.title || hero.name,
        posterPath: hero.poster_path,
        mediaType: hero.media_type || (hero.first_air_date ? 'tv' : 'movie'),
      })
      showToast('Adicionado à sua lista! 🎬', 'success')
    } catch { showToast('Já está na sua lista', 'info') }
  }

  return (
    <div className="page page--home">
      {hero && (
        <HeroCard
          item={hero}
          onWatch={() => goDetail(hero)}
          onAdd={addToList}
          onInfo={() => goDetail(hero)}
        />
      )}

      <div className="home-sections">
        <Section title="Continuar Assistindo" onMore={() => nav('/lista')}>
          {trending.slice(1, 5).map(item => (
            <MediaCard key={item.id} item={item} onClick={() => goDetail(item)} />
          ))}
        </Section>

        <Section title="🔥 Em Alta" loading={loadingTrending} onMore={() => nav('/buscar')}>
          {trending.slice(0, 10).map(item => (
            <MediaCard key={item.id} item={item} onClick={() => goDetail(item)} />
          ))}
        </Section>

        <Section title="🎬 Filmes Populares" loading={loadingPopular} onMore={() => nav('/buscar?tab=filmes')}>
          {popular.map(item => (
            <MediaCard key={item.id} item={item} onClick={() => nav(`/filme/${item.id}`)} />
          ))}
        </Section>

        <Section title="📺 Séries Top Avaliadas" loading={loadingPopular}>
          {topSeries.map(item => (
            <MediaCard key={item.id} item={item} onClick={() => nav(`/serie/${item.id}`)} />
          ))}
        </Section>

        <Section title="🎥 Em Cartaz Agora">
          {nowPlaying.map(item => (
            <MediaCard key={item.id} item={item} onClick={() => nav(`/filme/${item.id}`)} />
          ))}
        </Section>
      </div>
    </div>
  )
}
