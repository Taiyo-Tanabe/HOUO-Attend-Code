"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { getEvents } from "@/lib/api"
import EventCard from "@/components/EventCard"

export default function HomePage() {
  const { token, role, isLoading, login, logout } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [events, setEvents] = useState([])
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState(false)

  function loadEvents() {
    setFetching(true)
    setFetchError(false)
    getEvents()
      .then(setEvents)
      .catch(() => setFetchError(true))
      .finally(() => setFetching(false))
  }

  useEffect(() => {
    if (!token) return
    loadEvents()
  }, [token])

  async function handleLogin(e) {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      await login(code.trim())
      const redirect = searchParams.get("redirect")
      if (redirect) router.push(redirect)
    } catch (e) {
      if (e.message === "コードが違います") {
        setError("コードが違います")
      } else {
        setError("サーバーに接続できませんでした。再接続してください。")
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) return null

  if (!token) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "68vh", gap: "2.5rem" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.7rem", marginBottom: "0.6rem" }}>
            <span style={{ width: "40px", height: "40px", borderRadius: "12px", background: "var(--primary)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 900, color: "#000" }}>H</span>
            <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.01em" }}>HOUO Attend</span>
          </div>
          <p style={{ color: "var(--text-dim)", fontSize: "0.88rem", marginBottom: "0.25rem" }}>法桜交流会のイベント管理アプリへようこそ。</p>
          <p style={{ color: "var(--muted)", fontSize: "0.78rem" }}>コードを変更したい場合は管理者コードでログインしてください。</p>
        </div>

        <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: "320px", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="コードを入力" autoFocus style={{ textAlign: "center", fontSize: "1rem", letterSpacing: "0.1em", padding: "0.85rem 1rem" }} />
          {error && <p style={{ color: "var(--danger)", fontSize: "0.85rem", textAlign: "center" }}>{error}</p>}
          <button
            type="submit"
            disabled={submitting || !code.trim()}
            style={{
              background: submitting || !code.trim() ? "var(--card-2)" : "var(--primary)",
              color: submitting || !code.trim() ? "var(--muted)" : "#000",
              border: "none", borderRadius: "10px",
              padding: "0.85rem", fontWeight: 700, fontSize: "0.95rem",
              cursor: submitting || !code.trim() ? "not-allowed" : "pointer",
              transition: "opacity 0.15s",
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.1rem" }}>
        <span style={{ fontWeight: 600, fontSize: "0.78rem", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>イベント一覧</span>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <Link href="/events/new" style={{ background: "var(--primary)", color: "#000", padding: "0.4rem 1rem", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 700, textDecoration: "none" }}>
            ＋ 作成
          </Link>
          {role === "admin" && (
            <Link href="/settings" style={{ fontSize: "0.78rem", color: "var(--muted)", textDecoration: "none" }}>設定</Link>
          )}
          <button onClick={logout} style={{ fontSize: "0.78rem", color: "var(--muted)", background: "none", border: "none", cursor: "pointer" }}>退出</button>
        </div>
      </div>

      {fetching && <p style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 0", fontSize: "0.88rem" }}>読み込み中…</p>}
      {!fetching && fetchError && (
        <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--muted)" }}>
          <p style={{ fontSize: "0.88rem", marginBottom: "1rem" }}>読み込みに失敗しました。再接続してください。</p>
          <button onClick={loadEvents} style={{ background: "var(--primary)", color: "#000", border: "none", borderRadius: "8px", padding: "0.5rem 1.2rem", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
            再試行
          </button>
        </div>
      )}
      {!fetching && !fetchError && events.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--muted)" }}>
          <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📅</p>
          <p style={{ fontSize: "0.88rem" }}>イベントはまだありません</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {events.map((event) => <EventCard key={event.id} event={event} />)}
      </div>
    </div>
  )
}
