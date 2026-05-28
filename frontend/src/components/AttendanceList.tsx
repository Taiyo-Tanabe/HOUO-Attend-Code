"use client"

import { useState } from "react"
import { Attendance, updateAttendance, deleteAttendance } from "@/lib/api"

const STATUS: Record<Attendance["status"], { label: string; color: string }> = {
  attending:     { label: "参加",   color: "var(--primary)" },
  not_attending: { label: "不参加", color: "var(--muted)" },
  undecided:     { label: "未定",   color: "var(--warning)" },
}

const OPTIONS: { value: Attendance["status"]; label: string }[] = [
  { value: "attending",     label: "参加" },
  { value: "not_attending", label: "不参加" },
  { value: "undecided",     label: "未定" },
]

type Filter = "all" | Attendance["status"]

interface Props {
  eventId: string
  attendances: Attendance[]
  onUpdated: (a: Attendance) => void
  onDeleted: (id: string) => void
}

export default function AttendanceList({ eventId, attendances, onUpdated, onDeleted }: Props) {
  const [filter, setFilter] = useState<Filter>("all")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editStatus, setEditStatus] = useState<Attendance["status"]>("attending")
  const [editMemo, setEditMemo] = useState("")
  const [saving, setSaving] = useState(false)

  const counts = {
    all:          attendances.length,
    attending:    attendances.filter(a => a.status === "attending").length,
    not_attending: attendances.filter(a => a.status === "not_attending").length,
    undecided:    attendances.filter(a => a.status === "undecided").length,
  }

  const filtered = filter === "all" ? attendances : attendances.filter(a => a.status === filter)

  const tabs: { value: Filter; label: string; color: string }[] = [
    { value: "all",          label: "全員",   color: "var(--text-dim)" },
    { value: "attending",    label: "参加",   color: "var(--primary)" },
    { value: "not_attending", label: "不参加", color: "var(--muted)" },
    { value: "undecided",    label: "未定",   color: "var(--warning)" },
  ]

  function startEdit(a: Attendance) {
    setEditingId(a.id)
    setEditName(a.name)
    setEditStatus(a.status)
    setEditMemo(a.memo ?? "")
  }

  async function handleDelete(attendanceId: string) {
    if (!confirm("この回答を削除しますか？")) return
    await deleteAttendance(eventId, attendanceId)
    onDeleted(attendanceId)
    setEditingId(null)
  }

  async function handleSave(attendanceId: string) {
    if (!editName.trim()) return
    setSaving(true)
    try {
      const updated = await updateAttendance(eventId, attendanceId, editName.trim(), editStatus, editMemo.trim() || undefined)
      onUpdated(updated)
      setEditingId(null)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "18px", padding: "1rem 1.25rem" }}>
      {/* フィルタータブ */}
      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.85rem", flexWrap: "wrap" }}>
        {tabs.map((tab) => {
          const active = filter === tab.value
          return (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              style={{
                borderRadius: "9999px", padding: "0.3rem 0.75rem",
                fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
                border: `1px solid ${active ? tab.color : "var(--border)"}`,
                background: active ? `${tab.color}22` : "var(--card-2)",
                color: active ? tab.color : "var(--muted)",
                transition: "all 0.15s",
              }}
            >
              {tab.label} <span style={{ opacity: 0.85 }}>{counts[tab.value]}</span>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.85rem", padding: "0.75rem 0" }}>該当者なし</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {filtered.map((a, i) => {
            const { label, color } = STATUS[a.status]
            const isEditing = editingId === a.id

            return (
              <div key={a.id} style={{
                padding: "0.55rem 0",
                borderTop: i === 0 ? "none" : "1px solid var(--border)",
              }}>
                {isEditing ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      maxLength={50}
                      style={{ fontSize: "0.88rem" }}
                    />
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      {OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setEditStatus(opt.value)}
                          style={{
                            flex: 1, borderRadius: "9999px", padding: "0.45rem",
                            fontWeight: 700, fontSize: "0.8rem",
                            border: "1px solid var(--border)", cursor: "pointer",
                            background: editStatus === opt.value ? STATUS[opt.value].color : "var(--card-2)",
                            color: editStatus === opt.value && opt.value === "attending" ? "#fff" : "var(--text)",
                            opacity: editStatus === opt.value ? 1 : 0.6,
                          }}
                        >{opt.label}</button>
                      ))}
                    </div>
                    <textarea
                      value={editMemo}
                      onChange={(e) => setEditMemo(e.target.value)}
                      placeholder="備考（任意）"
                      rows={2}
                      maxLength={200}
                      style={{ fontSize: "0.85rem" }}
                    />
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button
                        onClick={() => handleSave(a.id)}
                        disabled={saving || !editName.trim()}
                        style={{
                          flex: 1, borderRadius: "9999px", padding: "0.5rem",
                          background: "linear-gradient(135deg, var(--primary), #0ea5e9)",
                          color: "#fff", border: "none", fontWeight: 700, fontSize: "0.85rem",
                          cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1,
                        }}
                      >{saving ? "保存中…" : "保存"}</button>
                      <button
                        onClick={() => setEditingId(null)}
                        style={{
                          flex: 1, borderRadius: "9999px", padding: "0.5rem",
                          background: "var(--card-2)", color: "var(--text-dim)",
                          border: "1px solid var(--border)", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer",
                        }}
                      >キャンセル</button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        style={{
                          flex: 1, borderRadius: "9999px", padding: "0.5rem",
                          background: "none", color: "var(--danger)",
                          border: "1px solid rgba(248,113,113,0.3)", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer",
                        }}
                      >削除</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: "0.9rem", color: "var(--text)" }}>{a.name}</span>
                      {a.memo && (
                        <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.2rem", lineHeight: 1.4 }}>{a.memo}</p>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0, marginLeft: "0.5rem" }}>
                      <span style={{ fontSize: "0.82rem", fontWeight: 600, color }}>{label}</span>
                      <button
                        onClick={() => startEdit(a)}
                        style={{
                          fontSize: "0.72rem", color: "var(--muted)", background: "none",
                          border: "none", cursor: "pointer", padding: "0.1rem 0.3rem",
                          borderRadius: "4px",
                        }}
                      >編集</button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
