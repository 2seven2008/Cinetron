import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../components/UI";

function BackHeader({ title, subtitle }) {
  const nav = useNavigate();
  return (
    <div className="back-header">
      <button className="back-btn" onClick={() => nav(-1)}>
        <ArrowLeft size={20} />
      </button>
      <div>
        <h1 className="page-title" style={{ marginBottom: 0 }}>
          {title}
        </h1>
        {subtitle && (
          <p className="page-subtitle" style={{ marginTop: 2 }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Configurações ──────────────────────────────────────
export function Configuracoes() {
  const { user } = useAuth();

  const items = [
    { label: "Idioma", value: "Português (Brasil)" },
    { label: "Verificar Atualizações", value: "" },
    { label: "Dispositivos", value: "1" },
    { label: "Limpar Cache", value: "" },
  ];

  return (
    <div className="page fade-up">
      <BackHeader title="Configurações" />

      <div className="user-card" style={{ marginBottom: 24 }}>
        <div className="avatar">👤</div>
        <div>
          <p className="user-name">Usuário</p>
          <p className="user-email">{user?.email}</p>
        </div>
      </div>

      <div className="menu-section">
        {items.map(({ label, value }) => (
          <button
            key={label}
            className="menu-item"
            onClick={() => showToast("Em breve!", "info")}
          >
            <span className="menu-item-label">{label}</span>
            <span className="menu-item-value">{value}</span>
            <ChevronRight size={16} className="menu-chevron" />
          </button>
        ))}
      </div>

      <div className="config-version">
        <p>Versão do App</p>
        <span>v1.0.0</span>
      </div>
    </div>
  );
}

// ── Privacidade ──────────────────────────────────────
export function Privacidade() {
  const nav = useNavigate();
  return (
    <div className="page fade-up">
      <BackHeader title="Privacidade e Dados" />
      <div className="privacy-box">
        <h3>Privacidade de Uso de Dados</h3>
        <p>
          O CINETRON respeita sua privacidade. Coletamos apenas os dados
          necessários para fornecer nossos serviços, como e-mail e preferências
          de conteúdo. Seus dados nunca serão vendidos a terceiros. Você pode
          solicitar a exclusão da sua conta e todos os dados associados a
          qualquer momento através das configurações.
        </p>
        <p>
          Utilizamos cookies e tecnologias similares para melhorar sua
          experiência de navegação. As informações de uso são anonimizadas e
          utilizadas apenas para melhorar nosso serviço. Ao continuar usando o
          CINETRON, você concorda com nossa política de privacidade.
        </p>
        <p>
          Para mais informações sobre como seus dados são tratados, entre em
          contato com nossa equipe de suporte. Levamos a segurança dos seus
          dados muito a sério e utilizamos criptografia de ponta para proteger
          todas as suas informações.
        </p>
      </div>
      <button className="btn-primary" onClick={() => nav(-1)}>
        Voltar
      </button>
    </div>
  );
}

// ── Ajuda ──────────────────────────────────────
export function Ajuda() {
  const nav = useNavigate();
  const faqs = [
    {
      q: "O Player não funciona",
      a: "Verifique sua conexão com a internet e tente novamente. Se o problema persistir, limpe o cache do aplicativo nas configurações.",
    },
    {
      q: "Não consigo baixar itens",
      a: "Downloads estão disponíveis apenas para usuários com plano premium ativo. Verifique sua assinatura nas configurações.",
    },
    {
      q: "Como funciona o CINETRON?",
      a: "O CINETRON é uma plataforma de streaming que permite assistir filmes e séries online, além de salvar conteúdo para assistir offline.",
    },
    {
      q: "Quando chegam novos itens?",
      a: "Novos conteúdos são adicionados semanalmente. Ative as notificações para ser avisado quando seu conteúdo favorito chegar.",
    },
  ];

  return (
    <div className="page fade-up">
      <BackHeader
        title="Ajuda e Suporte"
        subtitle="FAQ - Perguntas Frequentes"
      />

      <div className="faq-list">
        {faqs.map(({ q, a }) => (
          <details key={q} className="faq-item">
            <summary className="faq-question">
              <span>{q}</span>
              <span className="faq-icon">+</span>
            </summary>
            <p className="faq-answer">{a}</p>
          </details>
        ))}
      </div>

      <div className="help-contact">
        <h3>Precisa de mais ajuda?</h3>
        <button
          className="help-contact-btn"
          onClick={() => showToast("Abrindo suporte... 💬", "info")}
        >
          <span>👥</span>
          Entre em contato com a gente
        </button>
      </div>

      <button className="btn-primary" onClick={() => nav(-1)}>
        Voltar
      </button>
    </div>
  );
}
