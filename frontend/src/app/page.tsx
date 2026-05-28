"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { getEvents, Event } from "@/lib/api"
import EventCard from "@/components/EventCard"

export default function HomePage() {
  const { token, role, isLoading, login, logout } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    if (!token) return
    setFetching(true)
    getEvents()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setFetching(false))
  }, [token])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      await login(code.trim())
    } catch {
      setError("コードが違います")
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) return null

  if (!token) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "65vh", gap: "2.5rem" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "2.2rem", fontWeight: 900, letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
            <span style={{ color: "var(--brand)", textShadow: "0 0 20px rgba(0,230,118,0.7)" }}>HOUO</span>
            <span style={{ color: "var(--primary)", textShadow: "0 0 20px rgba(0,180,216,0.7)" }}> Attend</span>
          </p>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", letterSpacing: "0.02em" }}>団体コードを入力して入場してください</p>
        </div>

        <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: "320px", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="コードを入力"
            autoFocus
            style={{ textAlign: "center", fontSize: "1.1rem", letterSpacing: "0.15em" }}
          />
          {error && <p style={{ color: "var(--danger)", fontSize: "0.85rem", textAlign: "center", textShadow: "0 0 8px rgba(255,77,106,0.5)" }}>{error}</p>}
          <button
            type="submit"
            disabled={submitting || !code.trim()}
            style={{
              background: submitting || !code.trim()
                ? "var(--card-2)"
                : "linear-gradient(135deg, #00e676, #00b4d8)",
              color: "#fff",
              border: "none",
              borderRadius: "9999px",
              padding: "0.85rem",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: submitting || !code.trim() ? "not-allowed" : "pointer",
              opacity: submitting || !code.trim() ? 0.45 : 1,
              transition: "all 0.2s",
              boxShadow: submitting || !code.trim() ? "none" : "0 0 18px rgba(0,230,118,0.3)",
            }}
          >
            {submitting ? "確認中…" : "入場する"}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h1 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-dim)", letterSpacing: "0.04em" }}>イベント一覧</h1>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <Link href="/events/new" style={{
            background: "linear-gradient(135deg, #00e676, #00b4d8)",
            color: "#fff",
            padding: "0.35rem 0.9rem",
            borderRadius: "9999px",
            fontSize: "0.82rem",
            fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 0 12px rgba(0,229,255,0.25)",
          }}>
            ＋ 作成
          </Link>
          {role === "admin" && (
            <Link href="/settings" style={{ fontSize: "0.75rem", color: "var(--muted)", textDecoration: "underline" }}>
              設定
            </Link>
          )}
          <button onClick={logout} style={{ fontSize: "0.75rem", color: "var(--muted)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
            退出
          </button>
        </div>
      </div>

      {fetching && <p style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 0" }}>読み込み中…</p>}

      {!fetching && events.length === 0 && (
        <p style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 0" }}>イベントはまだありません</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
