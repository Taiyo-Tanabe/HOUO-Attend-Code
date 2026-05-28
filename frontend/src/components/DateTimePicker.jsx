"use client"

const sel = {
  background: "var(--card-2)",
  color: "var(--text)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  padding: "0.6rem 0.4rem",
  fontSize: "0.88rem",
  cursor: "pointer",
  outline: "none",
  flex: 1,
  minWidth: 0,
}

const dim = { ...sel, opacity: 0.35, cursor: "not-allowed" }

export default function DateTimePicker({ value, onChange }) {
  const now = new Date()
  const years = [now.getFullYear(), now.getFullYear() + 1, now.getFullYear() + 2]
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const maxDay = value.year && value.month ? new Date(value.year, value.month, 0).getDate() : 31
  const days = Array.from({ length: maxDay }, (_, i) => i + 1)
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

  function set(patch) {
    const next = { ...value, ...patch }
    if (next.year && next.month && next.day) {
      const max = new Date(next.year, next.month, 0).getDate()
      if (next.day > max) next.day = max
    }
    if (patch.hour === null) next.minute = null
    onChange(next)
  }

  const toNum = (v) => v === "" ? null : Number(v)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ display: "flex", gap: "0.4rem" }}>
        <select value={value.year ?? ""} onChange={e => set({ year: toNum(e.target.value) })} style={sel}>
          <option value="">年・未定</option>
          {years.map(y => <option key={y} value={y}>{y}年</option>)}
        </select>
        <select value={value.month ?? ""} onChange={e => set({ month: toNum(e.target.value) })} style={sel}>
          <option value="">月・未定</option>
          {months.map(m => <option key={m} value={m}>{m}月</option>)}
        </select>
        <select value={value.day ?? ""} onChange={e => set({ day: toNum(e.target.value) })} style={sel}>
          <option value="">日・未定</option>
          {days.map(d => <option key={d} value={d}>{d}日</option>)}
        </select>
      </div>
      <div style={{ display: "flex", gap: "0.4rem" }}>
        <select value={value.hour ?? ""} onChange={e => set({ hour: toNum(e.target.value) })} style={sel}>
          <option value="">時刻・未定</option>
          {hours.map(h => <option key={h} value={h}>{String(h).padStart(2, "0")}時</option>)}
        </select>
        <select
          value={value.minute ?? 0}
          onChange={e => set({ minute: Number(e.target.value) })}
          disabled={value.hour === null}
          style={value.hour === null ? dim : sel}
        >
          {minutes.map(m => <option key={m} value={m}>{String(m).padStart(2, "0")}分</option>)}
        </select>
      </div>
    </div>
  )
}
