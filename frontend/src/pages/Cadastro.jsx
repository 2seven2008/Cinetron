import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Btn, Input } from '../components/UI'

export default function Cadastro() {
  const nav = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    if (form.password !== form.confirm) return setError('As senhas não coincidem')
    if (form.password.length < 6) return setError('Senha deve ter ao menos 6 caracteres')
    setError('')
    setLoading(true)
    try {
      await register(form.email, form.password)
      nav('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page fade-up">
      <div className="auth-logo">CINETRON</div>
      <h1 className="auth-title">Criar conta</h1>
      <p className="auth-subtitle">Comece sua jornada cinematográfica</p>

      <form className="auth-form" onSubmit={submit}>
        <Input label="E-mail" icon={Mail} type="email" placeholder="seu@email.com" value={form.email} onChange={set('email')} required />
        <Input label="Senha" icon={Lock} type="password" placeholder="••••••••••" value={form.password} onChange={set('password')} required />
        <Input label="Confirmar Senha" icon={Lock} type="password" placeholder="••••••••••" value={form.confirm} onChange={set('confirm')} required />
        {error && <p className="form-error">{error}</p>}
        <Btn loading={loading} type="submit">Criar Conta</Btn>
      </form>

      <p className="auth-alt">Já tem uma Conta? <Link to="/login">Entre</Link></p>

      <div className="or-divider"><span>Ou continue com</span></div>
      <div className="social-row">
        <button className="social-btn">G</button>
        <button className="social-btn">f</button>
        <button className="social-btn">🍎</button>
      </div>
    </div>
  )
}
