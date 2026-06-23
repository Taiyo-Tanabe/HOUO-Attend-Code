"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { getEvent, deleteEvent } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import AttendanceForm from "@/components/AttendanceForm"
import AttendanceList from "@/components/AttendanceList"
import Spinner from "@/components/Spinner"

export default function EventPage() {
  const { id } = useParams()
  const router = useRouter()
  const { token, isLoading: authLoading } = useAuth()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null) // null | "not_found" | "server"

  useEffect(() => {
    if (!authLoading && !token) {
      router.replace(`/?redirect=/events/${id}`)
    }
  }, [authLoading, token, id])

  function loadEvent() {
    setLoading(true)
    setFetchError(null)
    getEvent(id)
      .then(setEvent)
      .catch(e => setFetchError(e.message === "イベントが見つかりません" ? "not_found" : "server"))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!token) return
    loadEvent()
  }, [id, token])

  async function handleDelete() {
    if (!confirm("このイベントを削除しますか？")) return
    await deleteEvent(id)
    router.push("/")
  }

  function handleAttended(attendance) {
    setEvent((prev) => {
      if (!prev) return prev
      const attendances = [...prev.attendances, attendance]
      return { ...prev, attendances, attending_count: attendances.filter(a => a.status === "attending").length }
    })
  }

  function handleAttendanceUpdated(updated) {
    setEvent((prev) => {
      if (!prev) return prev
      const attendances = prev.attendances.map(a => a.id === updated.id ? updated : a)
      return { ...prev, attendances, attending_count: attendances.filter(a => a.status === "attending").length }
    })
  }

  function handleAttendanceDeleted(deletedId) {
    setEvent((prev) => {
      if (!prev) return prev
      const attendances = prev.attendances.filter(a => a.id !== deletedId)
      return { ...prev, attendances, attending_count: attendances.filter(a => a.status === "attending").length }
    })
  }

  if (loading) return <Spinner />
  if (fetchError === "not_found") return <p style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 0", fontSize: "0.85rem" }}>イベントが見つかりません</p>
  if (fetchError === "server") return (
    <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--muted)" }}>
      <p style={{ fontSize: "0.88rem", marginBottom: "1rem" }}>読み込みに失敗しました。</p>
      <button onClick={loadEvent} style={{ background: "var(--primary)", color: "#000", border: "none", borderRadius: "8px", padding: "0.5rem 1.2rem", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
        再試行
      </button>
    </div>
  )

  const lineText = encodeURIComponent(`【HOUO Attend】\n${event.title}\n${event.date_display}\n${typeof window !== "undefined" ? window.location.href : ""}`)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      <Link href="/" style={{ fontSize: "0.78rem", color: "var(--muted)", textDecoration: "none" }}>← 一覧に戻る</Link>

      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "10px", padding: "1.1rem 1.25rem" }}>
        <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.3rem" }}>{event.date_display}</p>
        <h1 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.4rem", lineHeight: 1.4 }}>{event.title}</h1>
        {event.location && <p style={{ fontSize: "0.82rem", color: "var(--text-dim)", marginBottom: "0.4rem" }}>📍 {event.location}</p>}
        {event.description && <p style={{ fontSize: "0.85rem", color: "var(--text-dim)", whiteSpace: "pre-wrap", marginBottom: "0.75rem", lineHeight: 1.6 }}>{event.description}</p>}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingTop: "0.5rem", borderTop: "1px solid var(--border)" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--primary)" }} />
          <span style={{ fontSize: "0.82rem", color: "var(--text-dim)" }}>
            参加予定 <span style={{ color: "var(--primary)", fontWeight: 700, fontSize: "1.1rem" }}>{event.attending_count}</span> 人
          </span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <a href={`https://line.me/R/msg/text/?${lineText}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#06C755", color: "#fff", borderRadius: "8px", padding: "0.6rem", fontWeight: 600, fontSize: "0.82rem", textDecoration: "none" }}>
          LINEで共有
        </a>
        <Link href={`/events/${id}/edit`} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)", background: "none", color: "var(--text-dim)", borderRadius: "8px", padding: "0.6rem", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none" }}>
          編集
        </Link>
        <button onClick={handleDelete} style={{ flex: 1, border: "1px solid rgba(239,68,68,0.2)", background: "none", color: "var(--danger)", borderRadius: "8px", padding: "0.6rem", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}>
          削除
        </button>
      </div>

      <AttendanceForm eventId={id} onSubmitted={handleAttended} />
      <AttendanceList eventId={id} attendances={event.attendances} onUpdated={handleAttendanceUpdated} onDeleted={handleAttendanceDeleted} />
    </div>
  )
}
