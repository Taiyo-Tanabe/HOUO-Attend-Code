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
    getEvents().then(setEvents).catch(() => setEvents([])).finally(() => setFetching(false))
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
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "65vh", gap: "2rem" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
            <span style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "var(--primary)", display: "inline-flex",
              alignItems: "center", justifyContent: "center",
              fontSize: "1rem", fontWeight: 900, color: "#000",
            }}>H</span>
            <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)" }}>HOUO Attend</span>
          </div>
          <p style={{ color: "var(--muted)", fontSize: "0.82rem" }}>団体コードを入力してください</p>
        </div>

        <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: "300px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="コードを入力"
            autoFocus
            style={{ textAlign: "center", fontSize: "1rem", letterSpacing: "0.12em" }}
          />
          {error && <p style={{ color: "var(--danger)", fontSize: "0.82rem", textAlign: "center" }}>{error}</p>}
          <button
            type="submit"
            disabled={submitting || !code.trim()}
            style={{
              background: submitting || !code.trim() ? "var(--card-2)" : "var(--primary)",
              color: submitting || !code.trim() ? "var(--muted)" : "#000",
              border: "none", borderRadius: "8px",
              padding: "0.7rem", fontWeight: 700, fontSize: "0.9rem",
              cursor: submitting || !code.trim() ? "not-allowed" : "pointer",
              transition: "all 0.15s",
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
        <span style={{ fontWeight: 600, fontSize: "0.82rem", color: "var(--muted)", letterSpacing: "0.04em", textTransform: "uppercase" }}>Events</span>
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
          <Link href="/events/new" style={{
            background: "var(--primary)", color: "#000",
            padding: "0.35rem 0.85rem", borderRadius: "6px",
            fontSize: "0.8rem", fontWeight: 700, textDecoration: "none",
          }}>
            + New
          </Link>
          {role === "admin" && (
            <Link href="/settings" style={{ fontSize: "0.75rem", color: "var(--muted)", textDecoration: "none" }}>設定</Link>
          )}
          <button onClick={logout} style={{ fontSize: "0.75rem", color: "var(--muted)", background: "none", border: "none", cursor: "pointer" }}>
            退出
          </button>
        </div>
      </div>

      {fetching && <p style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 0", fontSize: "0.85rem" }}>読み込み中…</p>}
      {!fetching && events.length === 0 && (
        <p style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 0", fontSize: "0.85rem" }}>イベントはまだありません</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {events.map((event) => <EventCard key={event.id} event={event} />)}
      </div>
    </div>
  )
}
