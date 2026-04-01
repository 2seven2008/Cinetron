import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Play, Plus, Check, Download } from "lucide-react";
import tmdbService from "../services/tmdb";
import { watchlistService, downloadsService } from "../services/watchlist";
import { useAuth } from "../context/AuthContext";
import { showToast, MediaCard } from "../components/UI";

export default function Detail({ type }) {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inList, setInList] = useState(false);
  const [season, setSeason] = useState(1);
  const [seasonData, setSeasonData] = useState(null);

  useEffect(() => {
    load();
  }, [id, type]);

  const load = async () => {
    setLoading(true);
    try {
      const d =
        type === "serie"
          ? await tmdbService.tvDetail(id)
          : await tmdbService.movieDetail(id);
      setData(d);
      if (type === "serie") loadSeason(id, 1);
      // check watchlist
      if (user) {
        try {
          const r = await watchlistService.check(id);
          setInList(r.inList);
        } catch {}
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSeason = async (showId, num) => {
    try {
      const s = await tmdbService.season(showId, num);
      setSeasonData(s);
    } catch {}
  };

  const toggleList = async () => {
    if (!user) {
      nav("/login");
      return;
    }
    try {
      if (inList) {
        await watchlistService.remove(id);
        setInList(false);
        showToast("Removido da sua lista", "info");
      } else {
        await watchlistService.add({
          tmdbId: data.id,
          title: data.title || data.name,
          posterPath: data.poster_path,
          mediaType: type === "serie" ? "tv" : "movie",
          rating: data.vote_average,
        });
        setInList(true);
        showToast("Adicionado à lista! 🎬", "success");
      }
    } catch {
      showToast("Erro ao atualizar lista", "error");
    }
  };

  const addDownload = async () => {
    if (!user) {
      nav("/login");
      return;
    }
    try {
      await downloadsService.add({
        tmdbId: data.id,
        title: data.title || data.name,
        posterPath: data.poster_path,
        mediaType: type === "serie" ? "tv" : "movie",
      });
      showToast("Download adicionado! ⬇️", "success");
    } catch {
      showToast("Já nos downloads", "info");
    }
  };

  if (loading)
    return (
      <div className="detail-loading">
        <div className="spinner" />
      </div>
    );

  if (!data) return <div className="empty-state">Conteúdo não encontrado</div>;

  const backdrop = data.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}`
    : null;
  const poster = data.poster_path
    ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
    : null;
  const title = data.title || data.name;
  const year = (data.release_date || data.first_air_date || "").slice(0, 4);
  const runtime = data.runtime
    ? `${data.runtime}min`
    : data.number_of_seasons
      ? `${data.number_of_seasons} temporada(s)`
      : "";
  const genres = (data.genres || []).map((g) => g.name).join(" · ");
  const trailer = (data.videos?.results || []).find(
    (v) => v.type === "Trailer" && v.site === "YouTube",
  );
  const cast = (data.credits?.cast || []).slice(0, 10);
  const similar = (
    data.similar?.results ||
    data.recommendations?.results ||
    []
  ).slice(0, 10);

  return (
    <div className="detail-page fade-in">
      {/* Backdrop */}
      <div className="detail-backdrop">
        {backdrop && <img src={backdrop} alt={title} />}
        <div className="detail-backdrop__gradient" />
        <div className="detail-back">
          <button className="back-btn" onClick={() => nav(-1)}>
            <ArrowLeft size={20} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="detail-content">
        <div className="detail-inner">
          <div className="detail-header">
            {poster && (
              <img className="detail-poster" src={poster} alt={title} />
            )}
            <div className="detail-info">
              <h1 className="detail-title">{title}</h1>
              <div className="detail-meta">
                {year && <span>{year}</span>}
                {runtime && <span>{runtime}</span>}
                {data.vote_average > 0 && (
                  <span className="detail-rating">
                    <Star size={12} fill="currentColor" />{" "}
                    {data.vote_average.toFixed(1)}
                  </span>
                )}
              </div>
              {genres && <p className="detail-genres">{genres}</p>}

              {/* Actions */}
              <div className="detail-actions">
                {trailer ? (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-watch"
                  >
                    <Play size={16} fill="currentColor" /> Assistir Trailer
                  </a>
                ) : (
                  <button
                    className="btn-watch"
                    onClick={() => showToast("Player em breve! 🚀", "info")}
                  >
                    <Play size={16} fill="currentColor" /> Assistir
                  </button>
                )}
                <button
                  className={`btn-icon ${inList ? "btn-icon--active" : ""}`}
                  onClick={toggleList}
                  title={inList ? "Remover da lista" : "Adicionar à lista"}
                >
                  {inList ? <Check size={18} /> : <Plus size={18} />}
                </button>
                <button
                  className="btn-icon"
                  onClick={addDownload}
                  title="Download"
                >
                  <Download size={18} />
                </button>
              </div>

              {/* Overview */}
              {data.overview && (
                <div className="detail-section">
                  <p className="detail-overview">{data.overview}</p>
                </div>
              )}
            </div>
            {/* end detail-info */}
          </div>
          {/* end detail-header */}
        </div>
        {/* end detail-inner */}

        {/* Seasons (series only) */}
        {type === "serie" && data.number_of_seasons > 0 && (
          <div className="detail-section">
            <div className="seasons-header">
              <h2 className="section-title">Episódios</h2>
              <select
                className="season-select"
                value={season}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  setSeason(n);
                  loadSeason(id, n);
                }}
              >
                {[...Array(data.number_of_seasons)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Temporada {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {seasonData && (
              <div className="episodes-list">
                {(seasonData.episodes || []).map((ep) => (
                  <div key={ep.id} className="episode-card">
                    {ep.still_path && (
                      <img
                        className="episode-thumb"
                        src={`https://image.tmdb.org/t/p/w300${ep.still_path}`}
                        alt={ep.name}
                        loading="lazy"
                      />
                    )}
                    <div className="episode-info">
                      <p className="episode-num">Ep. {ep.episode_number}</p>
                      <p className="episode-title">{ep.name}</p>
                      {ep.runtime && (
                        <p className="episode-runtime">{ep.runtime}min</p>
                      )}
                      {ep.overview && (
                        <p className="episode-overview">
                          {ep.overview.slice(0, 100)}...
                        </p>
                      )}
                    </div>
                    <button
                      className="episode-play"
                      onClick={() => showToast("Player em breve! 🚀", "info")}
                    >
                      <Play size={14} fill="currentColor" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cast */}
        {cast.length > 0 && (
          <div className="detail-section">
            <h2 className="section-title">Elenco</h2>
            <div className="scroll-row cast-row">
              {cast.map((person) => (
                <div key={person.id} className="cast-card">
                  <div className="cast-img">
                    {person.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                        alt={person.name}
                      />
                    ) : (
                      <span>{person.name.charAt(0)}</span>
                    )}
                  </div>
                  <p className="cast-name">{person.name}</p>
                  <p className="cast-char">{person.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <div className="detail-section">
            <h2 className="section-title">Similares</h2>
            <div className="scroll-row">
              {similar.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onClick={() => {
                    const t = item.first_air_date ? "serie" : "filme";
                    nav(`/${t}/${item.id}`);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {/* end detail-content */}
    </div>
  );
}
