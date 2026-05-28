"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createEvent } from "@/lib/api"
import DateTimePicker from "@/components/DateTimePicker"

const label: React.CSSProperties = { fontSize: "0.78rem", fontWeight: 600, color: "var(--text-dim)", letterSpacing: "0.05em", display: "block", marginBottom: "0.4rem", textTransform: "uppercase" }

type DateFields = { year: number|null; month: number|null; day: number|null; hour: number|null; minute: number|null }

export default function NewEventPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [dateFields, setDateFields] = useState<DateFields>({ year: null, month: null, day: null, hour: null, minute: null })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setError("")
    setSubmitting(true)
    try {
      const event = await createEvent({
        title: title.trim(),
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        event_year:   dateFields.year,
        event_month:  dateFields.month,
        event_day:    dateFields.day,
        event_hour:   dateFields.hour,
        event_minute: dateFields.minute,
      })
      router.push(`/events/${event.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <Link href="/" style={{ fontSize: "0.82rem", color: "var(--primary)", textDecoration: "none" }}>← 一覧に戻る</Link>
      <h1 style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--text)" }}>イベントを作成</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div><label style={label}>タイトル *</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="例：第3回勉強会" maxLength={100} /></div>
        <div><label style={label}>日時</label><DateTimePicker value={dateFields} onChange={setDateFields} /></div>
        <div><label style={label}>場所</label><input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="例：3号館 402室" maxLength={200} /></div>
        <div><label style={label}>詳細</label><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="詳細の説明（省略可）" rows={4} /></div>

        {error && <p style={{ color: "var(--danger)", fontSize: "0.85rem" }}>{error}</p>}

        <button
          type="submit"
          disabled={submitting || !title.trim()}
          style={{
            background: submitting || !title.trim() ? "var(--card-2)" : "linear-gradient(135deg, var(--primary), #0ea5e9)",
            color: "var(--text)", border: "none", borderRadius: "9999px",
            padding: "0.85rem", fontWeight: 700, fontSize: "1rem",
            cursor: submitting || !title.trim() ? "not-allowed" : "pointer",
            opacity: submitting || !title.trim() ? 0.5 : 1, transition: "all 0.15s",
          }}
        >
          {submitting ? "作成中…" : "作成する"}
        </button>
      </form>
    </div>
  )
}
