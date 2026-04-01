import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Btn, Input } from "../components/UI";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      nav("/");
    } catch (err) {
      setError(err.response?.data?.message || "E-mail ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page fade-up" style={{ margin: "0 auto" }}>
      <div className="auth-logo">CINETRON</div>
      <h1 className="auth-title">Bem-vindo!</h1>
      <p className="auth-subtitle">Entre para assistir.</p>

      <form className="auth-form" onSubmit={submit}>
        <Input
          label="E-mail"
          icon={Mail}
          type="email"
          placeholder="seu@email.com"
          value={form.email}
          onChange={set("email")}
          required
        />
        <div>
          <Input
            label="Senha"
            icon={Lock}
            type="password"
            placeholder="••••••••••"
            value={form.password}
            onChange={set("password")}
            required
          />
          <Link to="/esqueci-senha" className="forgot-link">
            Esqueceu a senha?
          </Link>
        </div>
        {error && <p className="form-error">{error}</p>}
        <Btn loading={loading} type="submit">
          Entrar
        </Btn>
      </form>

      <p className="auth-alt">
        Não tem uma Conta? <Link to="/cadastro">Cadastrar-se</Link>
      </p>

      <div className="or-divider">
        <span>Ou continue com</span>
      </div>
      <div className="social-row">
        <button className="social-btn">G</button>
        <button className="social-btn">f</button>
        <button className="social-btn">🍎</button>
      </div>
    </div>
  );
}
