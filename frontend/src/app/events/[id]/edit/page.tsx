"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { getEvent, updateEvent } from "@/lib/api"
import DateTimePicker from "@/components/DateTimePicker"

const label: React.CSSProperties = { fontSize: "0.78rem", fontWeight: 600, color: "var(--text-dim)", letterSpacing: "0.05em", display: "block", marginBottom: "0.4rem", textTransform: "uppercase" }

type DateFields = { year: number|null; month: number|null; day: number|null; hour: number|null; minute: number|null }

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [dateFields, setDateFields] = useState<DateFields>({ year: null, month: null, day: null, hour: null, minute: null })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    getEvent(id).then((e) => {
      setTitle(e.title)
      setDescription(e.description ?? "")
      setLocation(e.location ?? "")
      setDateFields({
        year:   e.event_year,
        month:  e.event_month,
        day:    e.event_day,
        hour:   e.event_hour,
        minute: e.event_minute,
      })
      setLoading(false)
    })
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      await updateEvent(id, {
        title: title.trim(),
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        event_year:   dateFields.year,
        event_month:  dateFields.month,
        event_day:    dateFields.day,
        event_hour:   dateFields.hour,
        event_minute: dateFields.minute,
      })
      router.push(`/events/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 0" }}>読み込み中…</p>

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <Link href={`/events/${id}`} style={{ fontSize: "0.82rem", color: "var(--primary)", textDecoration: "none" }}>← 詳細に戻る</Link>
      <h1 style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--text)" }}>イベントを編集</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div><label style={label}>タイトル *</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} maxLength={100} /></div>
        <div><label style={label}>日時</label><DateTimePicker value={dateFields} onChange={setDateFields} /></div>
        <div><label style={label}>場所</label><input type="text" value={location} onChange={e => setLocation(e.target.value)} maxLength={200} /></div>
        <div><label style={label}>詳細</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} /></div>

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
          {submitting ? "保存中…" : "保存する"}
        </button>
      </form>
    </div>
  )
}
