"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { getEvent, updateEvent, generateAnnouncement } from "@/lib/api"
import DateTimePicker from "@/components/DateTimePicker"
import Spinner from "@/components/Spinner"

const label = { fontSize: "0.78rem", fontWeight: 600, color: "var(--text-dim)", letterSpacing: "0.05em", display: "block", marginBottom: "0.4rem", textTransform: "uppercase" }

export default function EditEventPage() {
  const { id } = useParams()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [dateFields, setDateFields] = useState({ year: null, month: null, day: null, hour: null, minute: null })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [announcement, setAnnouncement] = useState("")
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState("")

  useEffect(() => {
    getEvent(id).then((e) => {
      setTitle(e.title)
      setDescription(e.description ?? "")
      setLocation(e.location ?? "")
      setDateFields({ year: e.event_year, month: e.event_month, day: e.event_day, hour: e.event_hour, minute: e.event_minute })
      setLoading(false)
    })
  }, [id])

  async function handleGenerateAnnouncement() {
    setGenError("")
    setGenerating(true)
    try {
      const result = await generateAnnouncement({
        title: title.trim(),
        location: location.trim(),
        description: description.trim(),
        event_year: dateFields.year,
        event_month: dateFields.month,
        event_day: dateFields.day,
        event_hour: dateFields.hour,
        event_minute: dateFields.minute,
      })
      setAnnouncement(result.text)
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "生成に失敗しました")
    } finally {
      setGenerating(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      await updateEvent(id, {
        title: title.trim(),
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        event_year: dateFields.year, event_month: dateFields.month, event_day: dateFields.day,
        event_hour: dateFields.hour, event_minute: dateFields.minute,
      })
      router.push(`/events/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Spinner />

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
        <button type="submit" disabled={submitting || !title.trim()} style={{ background: submitting || !title.trim() ? "var(--card-2)" : "var(--primary)", color: submitting || !title.trim() ? "var(--muted)" : "#000", border: "none", borderRadius: "10px", padding: "0.85rem", fontWeight: 700, fontSize: "1rem", cursor: submitting || !title.trim() ? "not-allowed" : "pointer", transition: "all 0.15s" }}>
          {submitting ? "保存中…" : "保存する"}
        </button>
      </form>

      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <button
          type="button"
          onClick={handleGenerateAnnouncement}
          disabled={generating || !title.trim()}
          style={{ background: "none", border: "1px solid var(--border)", borderRadius: "10px", padding: "0.75rem", fontWeight: 600, fontSize: "0.9rem", color: generating || !title.trim() ? "var(--muted)" : "var(--text)", cursor: generating || !title.trim() ? "not-allowed" : "pointer", transition: "all 0.15s" }}
        >
          {generating ? "生成中…" : "✨ 告知文を生成する"}
        </button>
        {genError && <p style={{ color: "var(--danger)", fontSize: "0.85rem" }}>{genError}</p>}
        {announcement && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <textarea
              readOnly
              value={announcement}
              rows={7}
              style={{ resize: "vertical", fontSize: "0.88rem", lineHeight: 1.6 }}
            />
            <a
              href={`https://line.me/R/msg/text/?${encodeURIComponent(announcement)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#06C755", color: "#fff", borderRadius: "8px", padding: "0.6rem", fontWeight: 600, fontSize: "0.82rem", textDecoration: "none" }}
            >
              LINEで共有
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
