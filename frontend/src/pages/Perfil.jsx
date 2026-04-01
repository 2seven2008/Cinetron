import { useNavigate } from "react-router-dom";
import {
  Settings,
  Download,
  Shield,
  HelpCircle,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../components/UI";

export default function Perfil() {
  const nav = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    nav("/login");
    showToast("Até logo! 👋", "info");
  };

  const menu = [
    { icon: Settings, label: "Configurações", path: "/configuracoes" },
    { icon: Download, label: "Downloads", path: "/downloads" },
    { icon: Shield, label: "Privacidade e Dados", path: "/privacidade" },
    { icon: HelpCircle, label: "Ajuda e Suporte", path: "/ajuda" },
  ];

  return (
    <div className="page fade-up">
      <h1 className="page-title">Meu Perfil</h1>
      <p className="page-subtitle">Gerencie sua Conta e Preferências</p>

      <div className="user-card">
        <div className="avatar">👤</div>
        <div>
          <p className="user-name">Usuário</p>
          <p className="user-email">{user?.email}</p>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <p className="stat-num">99+</p>
          <p className="stat-label">Assistidos</p>
        </div>
        <div className="stat-card">
          <p className="stat-num">99+</p>
          <p className="stat-label">Minha Lista</p>
        </div>
        <div className="stat-card">
          <p className="stat-num">15h</p>
          <p className="stat-label">Esta Semana</p>
        </div>
      </div>

      <div className="menu-section">
        {menu.map(({ icon: Icon, label, path }) => (
          <button key={path} className="menu-item" onClick={() => nav(path)}>
            <span className="menu-item-icon">
              <Icon size={18} />
            </span>
            <span className="menu-item-label">{label}</span>
            <ChevronRight size={16} className="menu-chevron" />
          </button>
        ))}
      </div>

      <button className="btn-danger" onClick={handleLogout}>
        <LogOut size={16} style={{ marginRight: 8 }} />
        Sair da Conta
      </button>
    </div>
  );
}
