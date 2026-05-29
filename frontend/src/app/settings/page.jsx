"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { updateCodes } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"

const label = { fontSize: "0.78rem", fontWeight: 600, color: "var(--text-dim)", letterSpacing: "0.05em", display: "block", marginBottom: "0.4rem", textTransform: "uppercase" }

export default function SettingsPage() {
  const { role } = useAuth()
  const [ready, setReady] = useState(false)
  const [memberCode, setMemberCode] = useState("")
  const [adminCode, setAdminCode] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (role === "admin") setReady(true)
  }, [role])

  if (role !== "admin") {
    return <p style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 0" }}>管理者のみアクセスできます</p>
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!memberCode.trim() || !adminCode.trim()) return
    setError("")
    setSaving(true)
    try {
      await updateCodes({ member_code: memberCode.trim(), admin_code: adminCode.trim() })
      setMemberCode("")
      setAdminCode("")
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <Link href="/" style={{ fontSize: "0.82rem", color: "var(--primary)", textDecoration: "none" }}>← 一覧に戻る</Link>
      <h1 style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--text)" }}>コード設定</h1>
      {!ready ? (
        <p style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 0" }}>読み込み中…</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: "12px", padding: "0.85rem 1rem", fontSize: "0.82rem", color: "var(--warning)" }}>
            コードはハッシュ化して保存されるため現在の値は表示できません。変更する場合のみ入力してください。
          </div>
          <div><label style={label}>新しいメンバーコード（全員に共有）</label><input type="text" value={memberCode} onChange={e => setMemberCode(e.target.value)} placeholder="新しいコードを入力" /></div>
          <div><label style={label}>新しい管理者コード（自分だけが知る）</label><input type="text" value={adminCode} onChange={e => setAdminCode(e.target.value)} placeholder="新しいコードを入力" /></div>
          {error && <p style={{ color: "var(--danger)", fontSize: "0.85rem" }}>{error}</p>}
          {saved && <p style={{ color: "var(--success)", fontSize: "0.85rem", fontWeight: 600 }}>✓ 保存しました</p>}
          <button type="submit" disabled={saving || !memberCode.trim() || !adminCode.trim()} style={{ background: saving || !memberCode.trim() || !adminCode.trim() ? "var(--card-2)" : "var(--primary)", color: saving || !memberCode.trim() || !adminCode.trim() ? "var(--muted)" : "#000", border: "none", borderRadius: "10px", padding: "0.85rem", fontWeight: 700, fontSize: "1rem", cursor: saving || !memberCode.trim() || !adminCode.trim() ? "not-allowed" : "pointer", opacity: saving || !memberCode.trim() || !adminCode.trim() ? 0.5 : 1, transition: "all 0.15s" }}>
            {saving ? "保存中…" : "保存する"}
          </button>
        </form>
      )}
    </div>
  )
}
