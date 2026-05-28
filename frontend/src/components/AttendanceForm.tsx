"use client"

import { useState } from "react"
import { registerAttendance, Attendance } from "@/lib/api"

type Status = Attendance["status"]

const OPTIONS: { value: Status; label: string; glow: string }[] = [
  { value: "attending",     label: "参加",   glow: "rgba(0,229,255,0.35)" },
  { value: "not_attending", label: "不参加", glow: "rgba(120,80,255,0.3)" },
  { value: "undecided",     label: "未定",   glow: "rgba(255,214,0,0.3)" },
]

const ACTIVE_BG: Record<Status, string> = {
  attending:     "linear-gradient(135deg, #00e5ff, #7b2fff)",
  not_attending: "var(--card-hover)",
  undecided:     "rgba(255,214,0,0.15)",
}

interface Props {
  eventId: string
  onSubmitted: (a: Attendance) => void
}

export default function AttendanceForm({ eventId, onSubmitted }: Props) {
  const [name, setName] = useState("")
  const [status, setStatus] = useState<Status>("attending")
  const [memo, setMemo] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
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
      <div style={{
        background: "var(--card)", border: "1px solid rgba(0,229,255,0.25)",
        borderRadius: "16px", padding: "1.5rem", textAlign: "center",
        boxShadow: "0 0 20px rgba(0,229,255,0.08)",
      }}>
        <p style={{ fontWeight: 700, color: "var(--primary)", fontSize: "1.05rem", textShadow: "0 0 8px rgba(0,229,255,0.4)" }}>登録しました！</p>
        <button onClick={() => setDone(false)} style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--muted)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
          もう一度登録する
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: "var(--card)", border: "1px solid var(--border)",
      borderRadius: "16px", padding: "1.25rem",
      display: "flex", flexDirection: "column", gap: "0.85rem",
      boxShadow: "0 2px 20px rgba(0,0,0,0.4)",
    }}>
      <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", letterSpacing: "0.02em" }}>出欠を登録する</p>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="名前を入力"
        maxLength={50}
      />

      <div style={{ display: "flex", gap: "0.5rem" }}>
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setStatus(opt.value)}
            style={{
              flex: 1, borderRadius: "9999px", padding: "0.65rem",
              fontWeight: 700, fontSize: "0.85rem",
              border: status === opt.value ? "1px solid transparent" : "1px solid var(--border)",
              cursor: "pointer", transition: "all 0.15s",
              background: status === opt.value ? ACTIVE_BG[opt.value] : "var(--card-2)",
              color: "var(--text)",
              boxShadow: status === opt.value ? `0 0 12px ${opt.glow}` : "none",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <textarea
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="備考（任意）"
        rows={2}
        maxLength={200}
        style={{ fontSize: "0.88rem" }}
      />

      <button
        type="submit"
        disabled={submitting || !name.trim()}
        style={{
          background: submitting || !name.trim() ? "var(--card-2)" : "linear-gradient(135deg, #00e5ff, #7b2fff)",
          color: "#fff", border: "none", borderRadius: "9999px",
          padding: "0.8rem", fontWeight: 700, fontSize: "0.95rem",
          cursor: submitting || !name.trim() ? "not-allowed" : "pointer",
          opacity: submitting || !name.trim() ? 0.45 : 1,
          transition: "all 0.2s",
          boxShadow: submitting || !name.trim() ? "none" : "0 0 16px rgba(0,229,255,0.28)",
        }}
      >
        {submitting ? "登録中…" : "登録する"}
      </button>
    </form>
  )
}
