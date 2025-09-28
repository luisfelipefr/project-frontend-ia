import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../services/api'

type User = { username: string; roles?: string[] } | null

type AuthCtx = {
  user: User
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthCtx | null>(null)

function parseJwt(t: string) {
  try {
    const b64 = t.split('.')[1]
    return JSON.parse(atob(b64))
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [user, setUser] = useState<User>(null)

  useEffect(() => {
    if (!token) { setUser(null); return }
    const payload = parseJwt(token)
    if (payload) {
      const roles = Array.isArray(payload.roles) ? payload.roles : (payload.authorities || [])
      setUser({ username: payload.sub ?? payload.username ?? 'user', roles })
    }
  }, [token])

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    setToken(data.token)
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const value = useMemo(() => ({ user, token, login, logout }), [user, token])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
