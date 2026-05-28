"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getCodes, updateCodes, Codes } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"

const label: React.CSSProperties = { fontSize: "0.78rem", fontWeight: 600, color: "var(--text-dim)", letterSpacing: "0.05em", display: "block", marginBottom: "0.4rem", textTransform: "uppercase" }

export default function SettingsPage() {
  const { role } = useAuth()
  const [codes, setCodes] = useState<Codes | null>(null)
  const [memberCode, setMemberCode] = useState("")
  const [adminCode, setAdminCode] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (role !== "admin") return
    getCodes().then((c) => {
      setCodes(c)
      setMemberCode(c.member_code)
      setAdminCode(c.admin_code)
    })
  }, [role])

  if (role !== "admin") {
    return <p style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 0" }}>管理者のみアクセスできます</p>
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!memberCode.trim() || !adminCode.trim()) return
    setError("")
    setSaving(true)
    try {
      const updated = await updateCodes({ member_code: memberCode.trim(), admin_code: adminCode.trim() })
      setCodes(updated)
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

      {!codes ? (
        <p style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 0" }}>読み込み中…</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: "12px", padding: "0.85rem 1rem", fontSize: "0.82rem", color: "var(--warning)" }}>
            コードを変更すると古いコードは即座に無効になります。メンバーへの共有をお忘れなく。
          </div>

          <div><label style={label}>メンバーコード（全員に共有）</label><input type="text" value={memberCode} onChange={e => setMemberCode(e.target.value)} /></div>
          <div><label style={label}>管理者コード（自分だけが知る）</label><input type="text" value={adminCode} onChange={e => setAdminCode(e.target.value)} /></div>

          {error && <p style={{ color: "var(--danger)", fontSize: "0.85rem" }}>{error}</p>}
          {saved && <p style={{ color: "var(--success)", fontSize: "0.85rem", fontWeight: 600 }}>保存しました</p>}

          <button
            type="submit"
            disabled={saving || !memberCode.trim() || !adminCode.trim()}
            style={{
              background: saving || !memberCode.trim() || !adminCode.trim() ? "var(--card-2)" : "linear-gradient(135deg, var(--primary), #0ea5e9)",
              color: "var(--text)", border: "none", borderRadius: "9999px",
              padding: "0.85rem", fontWeight: 700, fontSize: "1rem",
              cursor: saving || !memberCode.trim() || !adminCode.trim() ? "not-allowed" : "pointer",
              opacity: saving || !memberCode.trim() || !adminCode.trim() ? 0.5 : 1,
              transition: "all 0.15s",
            }}
          >
            {saving ? "保存中…" : "保存する"}
          </button>
        </form>
      )}
    </div>
  )
}
