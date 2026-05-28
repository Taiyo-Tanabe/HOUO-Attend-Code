import Link from "next/link"

export default function EventCard({ event }) {
  return (
    <Link href={`/events/${event.id}`} style={{ textDecoration: "none" }}>
      <div style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "1.1rem 1.2rem",
        cursor: "pointer",
        transition: "border-color 0.15s, background 0.15s",
      }}
        onMouseEnter={e => {
          const el = e.currentTarget
          el.style.borderColor = "rgba(0,229,153,0.35)"
          el.style.background = "var(--card-hover)"
        }}
        onMouseLeave={e => {
          const el = e.currentTarget
          el.style.borderColor = "rgba(255,255,255,0.09)"
          el.style.background = "var(--card)"
        }}
      >
        <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "0.3rem" }}>{event.date_display}</p>
        <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)", lineHeight: 1.4, marginBottom: event.location ? "0.3rem" : "0.6rem" }}>{event.title}</p>
        {event.location && (
          <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginBottom: "0.6rem" }}>📍 {event.location}</p>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "0.3rem",
            background: "rgba(0,229,153,0.1)", color: "var(--primary)",
            borderRadius: "6px", padding: "0.2rem 0.6rem",
            fontSize: "0.78rem", fontWeight: 600,
          }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--primary)" }} />
            参加 {event.attending_count}人
          </span>
        </div>
      </div>
    </Link>
  )
}
