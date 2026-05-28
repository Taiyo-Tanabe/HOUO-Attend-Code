const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("houo_token")
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? "エラーが発生しました")
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

// ── 認証 ─────────────────────────────────────────────────────────

export type Role = "member" | "admin"

export interface TokenResponse {
  token: string
  role: Role
}

export function login(code: string): Promise<TokenResponse> {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ code }),
  })
}

// ── イベント ─────────────────────────────────────────────────────

export interface Event {
  id: string
  title: string
  description: string | null
  location: string | null
  event_year:   number | null
  event_month:  number | null
  event_day:    number | null
  event_hour:   number | null
  event_minute: number | null
  date_display: string
  created_at: string
  attending_count: number
}

export interface Attendance {
  id: string
  name: string
  status: "attending" | "not_attending" | "undecided"
  memo: string | null
  created_at: string
}

export interface EventDetail extends Event {
  attendances: Attendance[]
}

export function getEvents(): Promise<Event[]> {
  return request("/api/events")
}

export function getEvent(id: string): Promise<EventDetail> {
  return request(`/api/events/${id}`)
}

export function registerAttendance(
  eventId: string,
  name: string,
  status: Attendance["status"],
  memo?: string,
): Promise<Attendance> {
  return request(`/api/events/${eventId}/attend`, {
    method: "POST",
    body: JSON.stringify({ name, status, memo: memo || null }),
  })
}

export function updateAttendance(
  eventId: string,
  attendanceId: string,
  name: string,
  status: Attendance["status"],
  memo?: string,
): Promise<Attendance> {
  return request(`/api/events/${eventId}/attend/${attendanceId}`, {
    method: "PUT",
    body: JSON.stringify({ name, status, memo: memo || null }),
  })
}

export function deleteAttendance(eventId: string, attendanceId: string): Promise<void> {
  return request(`/api/events/${eventId}/attend/${attendanceId}`, { method: "DELETE" })
}

export interface EventFields {
  title?: string
  description?: string
  location?: string
  event_year?:   number | null
  event_month?:  number | null
  event_day?:    number | null
  event_hour?:   number | null
  event_minute?: number | null
}

export function createEvent(data: EventFields): Promise<Event> {
  return request("/api/events", { method: "POST", body: JSON.stringify(data) })
}

export function updateEvent(id: string, data: EventFields): Promise<Event> {
  return request(`/api/events/${id}`, { method: "PUT", body: JSON.stringify(data) })
}

export function deleteEvent(id: string): Promise<void> {
  return request(`/api/events/${id}`, { method: "DELETE" })
}

// ── 設定 ─────────────────────────────────────────────────────────

export interface Codes {
  member_code: string
  admin_code: string
}

export function getCodes(): Promise<Codes> {
  return request("/api/settings/codes")
}

export function updateCodes(data: Partial<Codes>): Promise<Codes> {
  return request("/api/settings/codes", { method: "PUT", body: JSON.stringify(data) })
}
