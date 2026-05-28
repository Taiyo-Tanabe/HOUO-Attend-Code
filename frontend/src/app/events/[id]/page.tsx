"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { getEvent, deleteEvent, EventDetail } from "@/lib/api"
import AttendanceForm from "@/components/AttendanceForm"
import AttendanceList from "@/components/AttendanceList"


const btnBase: React.CSSProperties = {
  flex: 1, border: "1px solid var(--border)", background: "none",
  color: "var(--text-dim)", borderRadius: "12px", padding: "0.6rem",
  fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", transition: "background 0.15s",
}

export default function EventPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [event, setEvent] = useState<EventDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEvent(id).then(setEvent).finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    if (!confirm("このイベントを削除しますか？")) return
    await deleteEvent(id)
    router.push("/")
  }

  function handleAttended(attendance: EventDetail["attendances"][0]) {
    setEvent((prev) => {
      if (!prev) return prev
      const attendances = [...prev.attendances, attendance]
      return { ...prev, attendances, attending_count: attendances.filter(a => a.status === "attending").length }
    })
  }

  function handleAttendanceUpdated(updated: EventDetail["attendances"][0]) {
    setEvent((prev) => {
      if (!prev) return prev
      const attendances = prev.attendances.map(a => a.id === updated.id ? updated : a)
      return { ...prev, attendances, attending_count: attendances.filter(a => a.status === "attending").length }
    })
  }

  function handleAttendanceDeleted(id: string) {
    setEvent((prev) => {
      if (!prev) return prev
      const attendances = prev.attendances.filter(a => a.id !== id)
      return { ...prev, attendances, attending_count: attendances.filter(a => a.status === "attending").length }
    })
  }

  if (loading) return <p style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 0" }}>読み込み中…</p>
  if (!event) return <p style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 0" }}>イベントが見つかりません</p>

  const lineText = encodeURIComponent(`【HOUO Attend】\n${event.title}\n${event.date_display}\n${typeof window !== "undefined" ? window.location.href : ""}`)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Link href="/" style={{ fontSize: "0.82rem", color: "var(--primary)", textDecoration: "none" }}>← 一覧に戻る</Link>

      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "18px", padding: "1.25rem 1.5rem" }}>
        <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "0.3rem" }}>{event.date_display}</p>
        <h1 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.5rem" }}>{event.title}</h1>
        {event.location && <p style={{ fontSize: "0.85rem", color: "var(--text-dim)", marginBottom: "0.5rem" }}>📍 {event.location}</p>}
        {event.description && <p style={{ fontSize: "0.9rem", color: "var(--text-dim)", whiteSpace: "pre-wrap", marginBottom: "0.75rem" }}>{event.description}</p>}
        <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          参加予定{" "}
          <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--primary)" }}>{event.attending_count}</span>
          {" "}人
        </p>
      </div>

      <a
        href={`https://line.me/R/msg/text/?${lineText}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "0.5rem", background: "#06C755", color: "#fff",
          borderRadius: "9999px", padding: "0.8rem", fontWeight: 700,
          fontSize: "0.95rem", textDecoration: "none",
        }}
      >
        LINEで共有する
      </a>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Link href={`/events/${id}/edit`} style={{ ...btnBase, textAlign: "center", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
          編集
        </Link>
        <button onClick={handleDelete} style={{ ...btnBase, color: "var(--danger)", borderColor: "rgba(248,113,113,0.3)" }}>
          削除
        </button>
      </div>

      <AttendanceForm eventId={id} onSubmitted={handleAttended} />
      <AttendanceList eventId={id} attendances={event.attendances} onUpdated={handleAttendanceUpdated} onDeleted={handleAttendanceDeleted} />
    </div>
  )
}
