"use client"

import { useState } from "react"
import { registerAttendance } from "@/lib/api"

const OPTIONS = [
  { value: "attending",     label: "✓ 参加",   color: "#00e599", bg: "rgba(0,229,153,0.1)" },
  { value: "not_attending", label: "✕ 不参加", color: "#a0a0a0", bg: "rgba(160,160,160,0.08)" },
  { value: "undecided",     label: "? 未定",   color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
]

export default function AttendanceForm({ eventId, onSubmitted }) {
  const [name, setName] = useState("")
  const [status, setStatus] = useState("attending")
  const [memo, setMemo] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    try {
      const result = await registerAttendance(eventId, name.trim(), status, memo.trim() || undefined)
      onSubmitted(result)
      setDone(true)
      setName("")
      setMemo("")
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div style={{ background: "var(--card)", border: "1px solid var(--border-hi)", borderRadius: "12px", padding: "1.4rem", textAlign: "center" }}>
        <p style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>✅</p>
        <p style={{ fontWeight: 700, color: "var(--primary)", fontSize: "0.95rem" }}>登録しました！</p>
        <button onClick={() => setDone(false)} style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--muted)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
          もう一度登録する
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.2rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      <p style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text-dim)" }}>出欠を登録する</p>

      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="名前" maxLength={50} />

      <div style={{ display: "flex", gap: "0.5rem" }}>
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setStatus(opt.value)}
            style={{
              flex: 1, borderRadius: "10px", padding: "0.65rem 0.25rem",
              fontWeight: 600, fontSize: "0.82rem",
              border: `1px solid ${status === opt.value ? opt.color : "var(--border)"}`,
              cursor: "pointer", transition: "all 0.15s",
              background: status === opt.value ? opt.bg : "transparent",
              color: status === opt.value ? opt.color : "var(--muted)",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="備考（任意）" rows={2} maxLength={200} />

      <button
        type="submit"
        disabled={submitting || !name.trim()}
        style={{
          background: submitting || !name.trim() ? "var(--card-2)" : "var(--primary)",
          color: submitting || !name.trim() ? "var(--muted)" : "#000",
          border: "none", borderRadius: "10px",
          padding: "0.8rem", fontWeight: 700, fontSize: "0.95rem",
          cursor: submitting || !name.trim() ? "not-allowed" : "pointer",
          transition: "all 0.15s",
        }}
      >
        {submitting ? "登録中…" : "登録する"}
      </button>
    </form>
  )
}
