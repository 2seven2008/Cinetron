import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

// ── Button ──────────────────────────────────────
export function Btn({ children, variant = 'primary', loading, className = '', ...props }) {
  const base = {
    primary: 'btn-primary',
    outline: 'btn-outline',
    danger: 'btn-danger',
    ghost: 'btn-ghost',
  }[variant]
  return (
    <button className={`${base} ${className}`} disabled={loading} {...props}>
      {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2, margin: '0 auto' }} /> : children}
    </button>
  )
}

// ── Input ──────────────────────────────────────
export function Input({ label, icon: Icon, type = 'text', ...props }) {
  const [show, setShow] = useState(false)
  const isPass = type === 'password'
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrap">
        {Icon && <Icon size={18} className="input-icon" />}
        <input type={isPass && show ? 'text' : type} {...props} />
        {isPass && (
          <button type="button" className="eye-btn" onClick={() => setShow(s => !s)}>
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  )
}

// ── MediaCard ──────────────────────────────────────
export function MediaCard({ item, onClick, size = 'md' }) {
  const [imgErr, setImgErr] = useState(false)
  const poster = item.poster_path
    ? `https://image.tmdb.org/t/p/${size === 'lg' ? 'w500' : 'w342'}${item.poster_path}`
    : null
  const title = item.title || item.name || 'Sem título'
  const year = (item.release_date || item.first_air_date || '').slice(0, 4)
  const rating = item.vote_average?.toFixed(1)

  return (
    <div className={`media-card media-card--${size}`} onClick={onClick}>
      <div className="media-card__img">
        {poster && !imgErr
          ? <img src={poster} alt={title} onError={() => setImgErr(true)} loading="lazy" />
          : <div className="media-card__placeholder"><span>{title.charAt(0)}</span></div>
        }
        <div className="media-card__type-badge">
          {item.media_type === 'tv' || item.first_air_date ? 'SÉRIE' : 'FILME'}
        </div>
      </div>
      <div className="media-card__info">
        <p className="media-card__title">{title}</p>
        <div className="media-card__meta">
          {rating && <span className="star-badge">★ {rating}</span>}
          {year && <span>{year}</span>}
        </div>
      </div>
    </div>
  )
}

// ── HeroCard ──────────────────────────────────────
export function HeroCard({ item, onWatch, onAdd, onInfo }) {
  const backdrop = item?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`
    : null
  const title = item?.title || item?.name
  const year = (item?.release_date || item?.first_air_date || '').slice(0, 4)
  const type = item?.first_air_date ? 'Série' : 'Filme'
  const desc = item?.overview

  return (
    <div className="hero">
      <div className="hero__bg">
        {backdrop && <img src={backdrop} alt={title} />}
        <div className="hero__gradient" />
      </div>
      <div className="hero__content">
        <div className="hero__badge">🔥 #1 em Alta hoje</div>
        <h1 className="hero__title">{title}</h1>
        <p className="hero__meta">{year} · {type}</p>
        {desc && <p className="hero__desc">{desc.slice(0, 120)}...</p>}
        <div className="hero__actions">
          <button className="btn-watch" onClick={onWatch}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            Assistir
          </button>
          <button className="btn-icon" onClick={onAdd} title="Adicionar à lista">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
          </button>
          <button className="btn-icon" onClick={onInfo} title="Mais informações">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Section ──────────────────────────────────────
export function Section({ title, onMore, children, loading }) {
  return (
    <section className="section">
      <div className="section__header">
        <h2 className="section__title">{title}</h2>
        {onMore && <button className="section__more" onClick={onMore}>Ver todos →</button>}
      </div>
      {loading
        ? <div className="scroll-row">{[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ width: 110, height: 165, flexShrink: 0, borderRadius: 10 }} />)}</div>
        : <div className="scroll-row">{children}</div>
      }
    </section>
  )
}

// ── SkeletonGrid ──────────────────────────────────────
export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid-2">
      {[...Array(count)].map((_, i) => (
        <div key={i}>
          <div className="skeleton" style={{ width: '100%', aspectRatio: '2/3', borderRadius: 10 }} />
          <div className="skeleton" style={{ width: '70%', height: 14, marginTop: 8, borderRadius: 6 }} />
          <div className="skeleton" style={{ width: '40%', height: 12, marginTop: 5, borderRadius: 6 }} />
        </div>
      ))}
    </div>
  )
}

// ── Toast ──────────────────────────────────────
let toastTimer
export function showToast(msg, type = 'info') {
  clearTimeout(toastTimer)
  const existing = document.getElementById('cinetron-toast')
  if (existing) existing.remove()
  const el = document.createElement('div')
  el.id = 'cinetron-toast'
  el.className = `toast toast--${type}`
  el.textContent = msg
  document.body.appendChild(el)
  toastTimer = setTimeout(() => el.remove(), 3000)
}
