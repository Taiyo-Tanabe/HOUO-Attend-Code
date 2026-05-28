"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { login as apiLogin, Role } from "@/lib/api"

interface AuthState {
  token: string | null
  role: Role | null
  isLoading: boolean
  login: (code: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem("houo_token")
    const savedRole = localStorage.getItem("houo_role") as Role | null
    if (savedToken && savedRole) {
      setToken(savedToken)
      setRole(savedRole)
    }
    setIsLoading(false)
  }, [])

  async function login(code: string) {
    const res = await apiLogin(code)
    localStorage.setItem("houo_token", res.token)
    localStorage.setItem("houo_role", res.role)
    setToken(res.token)
    setRole(res.role)
  }

  function logout() {
    localStorage.removeItem("houo_token")
    localStorage.removeItem("houo_role")
    setToken(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ token, role, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
