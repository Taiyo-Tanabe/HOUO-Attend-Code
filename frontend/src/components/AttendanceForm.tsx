"use client"

import { useState } from "react"
import { registerAttendance, Attendance } from "@/lib/api"

type Status = Attendance["status"]

const OPTIONS: { value: Status; label: string }[] = [
  { value: "attending",     label: "参加" },
  { value: "not_attending", label: "不参加" },
  { value: "undecided",     label: "未定" },
]

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
      <div style={{ background: "var(--card)", border: "1px solid var(--border-hi)", borderRadius: "10px", padding: "1.25rem", textAlign: "center" }}>
        <p style={{ fontWeight: 600, color: "var(--primary)", fontSize: "0.95rem" }}>✓ 登録しました</p>
        <button onClick={() => setDone(false)} style={{ marginTop: "0.4rem", fontSize: "0.78rem", color: "var(--muted)", background: "none", border: "none", cursor: "pointer" }}>
          もう一度登録する
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "10px", padding: "1.1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-dim)", letterSpacing: "0.03em" }}>出欠を登録する</p>

      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="名前" maxLength={50} />

      <div style={{ display: "flex", gap: "0.4rem" }}>
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setStatus(opt.value)}
            style={{
              flex: 1, borderRadius: "6px", padding: "0.55rem",
              fontWeight: 600, fontSize: "0.82rem",
              border: status === opt.value ? "1px solid var(--primary)" : "1px solid var(--border)",
              cursor: "pointer", transition: "all 0.15s",
              background: status === opt.value ? "rgba(0,229,153,0.1)" : "var(--card-2)",
              color: status === opt.value ? "var(--primary)" : "var(--text-dim)",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="備考（任意）" rows={2} maxLength={200} style={{ fontSize: "0.85rem" }} />

      <button
        type="submit"
        disabled={submitting || !name.trim()}
        style={{
          background: submitting || !name.trim() ? "var(--card-2)" : "var(--primary)",
          color: submitting || !name.trim() ? "var(--muted)" : "#000",
          border: "none", borderRadius: "8px",
          padding: "0.7rem", fontWeight: 700, fontSize: "0.88rem",
          cursor: submitting || !name.trim() ? "not-allowed" : "pointer",
          transition: "all 0.15s",
        }}
      >
        {submitting ? "登録中…" : "登録する"}
      </button>
    </form>
  )
}
