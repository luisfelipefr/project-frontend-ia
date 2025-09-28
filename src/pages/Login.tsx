import { FormEvent, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      await login(email, password)
      window.location.href = '/'
    } catch (error: any) {
      setErr(error?.response?.data ?? 'Falha no login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid bg-gradient-to-br from-slate-50 to-slate-100 bg-login-texture bg-center bg-no-repeat bg-cover">
      <div className=" w-[92%] max-w-3xl rounded-2xl bg-white shadow-xl p-6 md:p-8 items-center justify-center flex flex-col">
        <h1 className="text-2xl font-semibold text-slate-900">Entrar</h1>
        <p className="text-slate-500 text-1xl mt-1">Acesse com seu e-mail e senha.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4 w-[50%]">
          <div>
            <label className="block text-sm text-slate-600 mb-1">E-mail</label>
            <input
              className="w-[100%] rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">Senha</label>
            <input
              className="w-[100%] rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
              // &#8226 é o bullet point 
              placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-[100%] rounded-lg bg-slate-900 text-white py-2.5 font-medium hover:opacity-95 active:opacity-90 transition disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          {err && <p className="text-sm text-rose-600">{err}</p>}
        </form>

        <p className="mt-6 text-xs text-slate-500 text-center">
          Seja bem vindo de volta!
        </p>
      </div>
    </div>
  )
}
