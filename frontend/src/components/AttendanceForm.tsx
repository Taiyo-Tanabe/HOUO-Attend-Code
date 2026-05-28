"use client"

import { useState } from "react"
import { registerAttendance, Attendance } from "@/lib/api"

type Status = Attendance["status"]

const OPTIONS: { value: Status; label: string; active: string }[] = [
  { value: "attending",     label: "参加",   active: "linear-gradient(135deg, var(--primary), #0ea5e9)" },
  { value: "not_attending", label: "不参加", active: "var(--card-hover)" },
  { value: "undecided",     label: "未定",   active: "rgba(251,191,36,0.25)" },
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
      <div style={{ background: "rgba(41,182,246,0.08)", border: "1px solid rgba(41,182,246,0.2)", borderRadius: "18px", padding: "1.5rem", textAlign: "center" }}>
        <p style={{ fontWeight: 700, color: "var(--primary)", fontSize: "1.05rem" }}>登録しました！</p>
        <button onClick={() => setDone(false)} style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--muted)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
          もう一度登録する
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "18px", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text)" }}>出欠を登録する</p>

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
              border: "1px solid var(--border)", cursor: "pointer", transition: "all 0.15s",
              background: status === opt.value ? opt.active : "var(--card-2)",
              color: "var(--text)",
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
          background: submitting || !name.trim() ? "var(--card-2)" : "linear-gradient(135deg, var(--primary), #0ea5e9)",
          color: "var(--text)", border: "none", borderRadius: "9999px",
          padding: "0.8rem", fontWeight: 700, fontSize: "0.95rem",
          cursor: submitting || !name.trim() ? "not-allowed" : "pointer",
          opacity: submitting || !name.trim() ? 0.5 : 1, transition: "all 0.15s",
        }}
      >
        {submitting ? "登録中…" : "登録する"}
      </button>
    </form>
  )
}
