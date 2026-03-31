import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { Btn, Input } from '../components/UI'

export default function EsqueciSenha() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="auth-page fade-up">
      <div className="auth-logo">CINETRON</div>
      <h1 className="auth-title">Esqueci a Senha</h1>
      <p className="auth-subtitle">Recuperação de Senha</p>

      {sent ? (
        <div className="success-box">
          <div className="success-icon">✉️</div>
          <h3>E-mail enviado!</h3>
          <p>Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.</p>
          <Link to="/login"><Btn style={{ marginTop: 20 }}>Voltar ao Login</Btn></Link>
        </div>
      ) : (
        <form className="auth-form" onSubmit={submit}>
          <Input label="E-mail" icon={Mail} type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
          <Btn loading={loading} type="submit">Enviar Código de Recuperação</Btn>
        </form>
      )}

      <p className="auth-alt">Lembrou a senha? <Link to="/login">Entre</Link></p>
    </div>
  )
}
