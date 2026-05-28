import Link from "next/link"
import { Event } from "@/lib/api"

export default function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/events/${event.id}`} style={{ textDecoration: "none" }}>
      <div style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "1rem 1.25rem",
        cursor: "pointer",
        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.15s",
        boxShadow: "0 2px 20px rgba(0,0,0,0.4)",
      }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement
          el.style.borderColor = "rgba(0,229,255,0.4)"
          el.style.boxShadow = "0 0 20px rgba(0,229,255,0.12), 0 4px 24px rgba(0,0,0,0.5)"
          el.style.transform = "translateY(-2px)"
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement
          el.style.borderColor = "rgba(120,80,255,0.2)"
          el.style.boxShadow = "0 2px 20px rgba(0,0,0,0.4)"
          el.style.transform = "translateY(0)"
        }}
      >
        <p style={{ fontSize: "0.73rem", color: "var(--muted)", marginBottom: "0.3rem", letterSpacing: "0.04em" }}>{event.date_display}</p>
        <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)", marginBottom: "0.3rem", lineHeight: 1.4 }}>{event.title}</p>
        {event.location && (
          <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginBottom: "0.5rem" }}>📍 {event.location}</p>
        )}
        <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
          参加予定{" "}
          <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--primary)", textShadow: "0 0 8px rgba(0,229,255,0.5)" }}>{event.attending_count}</span>
          {" "}人
        </p>
      </div>
    </Link>
  )
}
