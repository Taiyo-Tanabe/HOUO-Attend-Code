"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { login as apiLogin } from "@/lib/api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [role, setRole] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem("houo_token")
    const savedRole = localStorage.getItem("houo_role")
    if (savedToken && savedRole) {
      setToken(savedToken)
      setRole(savedRole)
    }
    setIsLoading(false)
  }, [])

  async function login(code) {
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

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
