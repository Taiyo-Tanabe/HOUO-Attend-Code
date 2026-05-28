import Link from "next/link"
import { Event } from "@/lib/api"

export default function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/events/${event.id}`} style={{ textDecoration: "none" }}>
      <div style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "18px",
        padding: "1rem 1.25rem",
        cursor: "pointer",
        transition: "background 0.15s, transform 0.15s",
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--card-hover)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)" }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--card)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)" }}
      >
        <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "0.3rem" }}>{event.date_display}</p>
        <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)", marginBottom: "0.3rem", lineHeight: 1.4 }}>{event.title}</p>
        {event.location && (
          <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginBottom: "0.5rem" }}>📍 {event.location}</p>
        )}
        <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          参加予定{" "}
          <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--primary)" }}>{event.attending_count}</span>
          {" "}人
        </p>
      </div>
    </Link>
  )
}
