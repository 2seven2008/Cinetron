import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Search, Bookmark, User, Download } from 'lucide-react'

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'Início' },
  { path: '/buscar', icon: Search, label: 'Buscar' },
  { path: '/lista', icon: Bookmark, label: 'Minha Lista' },
  { path: '/downloads', icon: Download, label: 'Downloads' },
  { path: '/perfil', icon: User, label: 'Perfil' },
]

export function BottomNav() {
  const nav = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
        const active = pathname === path
        return (
          <button key={path} className={`nav-item ${active ? 'nav-item--active' : ''}`} onClick={() => nav(path)}>
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            <span>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export function Sidebar() {
  const nav = useNavigate()
  const { pathname } = useLocation()

  return (
    <aside className="sidebar">
      <div className="sidebar__logo" onClick={() => nav('/')}>CINETRON</div>
      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const active = pathname === path
          return (
            <button key={path} className={`sidebar__item ${active ? 'sidebar__item--active' : ''}`} onClick={() => nav(path)}>
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span>{label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
