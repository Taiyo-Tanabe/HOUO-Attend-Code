import Link from "next/link"
import { Event } from "@/lib/api"

export default function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/events/${event.id}`} style={{ textDecoration: "none" }}>
      <div style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "10px",
        padding: "1rem 1.1rem",
        cursor: "pointer",
        transition: "border-color 0.15s, background 0.15s",
      }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement
          el.style.borderColor = "rgba(0,229,153,0.3)"
          el.style.background = "var(--card-hover)"
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement
          el.style.borderColor = "rgba(255,255,255,0.08)"
          el.style.background = "var(--card)"
        }}
      >
        <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.25rem" }}>{event.date_display}</p>
        <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text)", marginBottom: "0.25rem", lineHeight: 1.4 }}>{event.title}</p>
        {event.location && (
          <p style={{ fontSize: "0.78rem", color: "var(--text-dim)", marginBottom: "0.4rem" }}>📍 {event.location}</p>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.5rem" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--primary)", flexShrink: 0 }} />
          <span style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
            参加 <span style={{ color: "var(--primary)", fontWeight: 700 }}>{event.attending_count}</span> 人
          </span>
        </div>
      </div>
    </Link>
  )
}
