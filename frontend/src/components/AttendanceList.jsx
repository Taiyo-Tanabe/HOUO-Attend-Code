"use client"

import { useState } from "react"
import { updateAttendance, deleteAttendance } from "@/lib/api"

const STATUS = {
  attending:     { label: "参加",   color: "#00e599", bg: "rgba(0,229,153,0.12)" },
  not_attending: { label: "不参加", color: "#888",    bg: "rgba(136,136,136,0.1)" },
  undecided:     { label: "未定",   color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
}

const OPTIONS = [
  { value: "attending",     label: "参加" },
  { value: "not_attending", label: "不参加" },
  { value: "undecided",     label: "未定" },
]

export default function AttendanceList({ eventId, attendances, onUpdated, onDeleted }) {
  const [filter, setFilter] = useState("all")
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState("")
  const [editStatus, setEditStatus] = useState("attending")
  const [editMemo, setEditMemo] = useState("")
  const [saving, setSaving] = useState(false)

  const counts = {
    all:           attendances.length,
    attending:     attendances.filter(a => a.status === "attending").length,
    not_attending: attendances.filter(a => a.status === "not_attending").length,
    undecided:     attendances.filter(a => a.status === "undecided").length,
  }

  const filtered = filter === "all" ? attendances : attendances.filter(a => a.status === filter)

  const tabs = [
    { value: "all",           label: "全員" },
    { value: "attending",     label: "参加" },
    { value: "not_attending", label: "不参加" },
    { value: "undecided",     label: "未定" },
  ]

  function startEdit(a) {
    setEditingId(a.id)
    setEditName(a.name)
    setEditStatus(a.status)
    setEditMemo(a.memo ?? "")
  }

  async function handleDelete(attendanceId) {
    if (!confirm("この回答を削除しますか？")) return
    await deleteAttendance(eventId, attendanceId)
    onDeleted(attendanceId)
    setEditingId(null)
  }

  async function handleSave(attendanceId) {
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
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
        {tabs.map((tab) => {
          const active = filter === tab.value
          return (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              style={{
                flex: 1, padding: "0.7rem 0.25rem",
                fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
                border: "none",
                borderBottom: active ? "2px solid var(--primary)" : "2px solid transparent",
                background: "transparent",
                color: active ? "var(--primary)" : "var(--muted)",
                transition: "color 0.15s",
              }}
            >
              {tab.label}
              <span style={{
                marginLeft: "0.3rem",
                background: active ? "rgba(0,229,153,0.15)" : "rgba(255,255,255,0.06)",
                color: active ? "var(--primary)" : "var(--muted)",
                borderRadius: "4px", padding: "0 0.35rem",
                fontSize: "0.72rem", fontWeight: 700,
              }}>{counts[tab.value]}</span>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.85rem", padding: "1.5rem 0" }}>該当者なし</p>
      ) : (
        <div>
          {filtered.map((a, i) => {
            const s = STATUS[a.status]
            const isEditing = editingId === a.id
            return (
              <div key={a.id} style={{ padding: "0.9rem 1rem", borderTop: i === 0 ? "none" : "1px solid var(--border)" }}>
                {isEditing ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} maxLength={50} />
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      {OPTIONS.map((opt) => {
                        const os = STATUS[opt.value]
                        const active = editStatus === opt.value
                        return (
                          <button key={opt.value} type="button" onClick={() => setEditStatus(opt.value)} style={{
                            flex: 1, borderRadius: "8px", padding: "0.5rem",
                            fontWeight: 600, fontSize: "0.82rem",
                            border: `1px solid ${active ? os.color : "var(--border)"}`,
                            cursor: "pointer",
                            background: active ? os.bg : "transparent",
                            color: active ? os.color : "var(--muted)",
                          }}>{opt.label}</button>
                        )
                      })}
                    </div>
                    <textarea value={editMemo} onChange={(e) => setEditMemo(e.target.value)} placeholder="備考（任意）" rows={2} maxLength={200} />
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button onClick={() => handleSave(a.id)} disabled={saving || !editName.trim()} style={{
                        flex: 2, borderRadius: "8px", padding: "0.6rem",
                        background: "var(--primary)", color: "#000",
                        border: "none", fontWeight: 700, fontSize: "0.85rem",
                        cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1,
                      }}>{saving ? "保存中…" : "保存"}</button>
                      <button onClick={() => setEditingId(null)} style={{
                        flex: 1, borderRadius: "8px", padding: "0.6rem",
                        background: "transparent", color: "var(--text-dim)",
                        border: "1px solid var(--border)", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer",
                      }}>キャンセル</button>
                      <button onClick={() => handleDelete(a.id)} style={{
                        flex: 1, borderRadius: "8px", padding: "0.6rem",
                        background: "transparent", color: "var(--danger)",
                        border: "1px solid rgba(240,82,82,0.25)", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer",
                      }}>削除</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: "0.92rem", color: "var(--text)", fontWeight: 500 }}>{a.name}</span>
                      {a.memo && <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.2rem", lineHeight: 1.45 }}>{a.memo}</p>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: s.color, background: s.bg, borderRadius: "5px", padding: "0.15rem 0.5rem" }}>{s.label}</span>
                      <button onClick={() => startEdit(a)} style={{ fontSize: "0.75rem", color: "var(--muted)", background: "none", border: "1px solid var(--border)", borderRadius: "5px", cursor: "pointer", padding: "0.15rem 0.5rem" }}>編集</button>
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
