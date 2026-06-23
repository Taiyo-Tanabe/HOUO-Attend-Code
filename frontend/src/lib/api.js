const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

function getToken() {
  if (typeof window === "undefined") return null
  return localStorage.getItem("houo_token")
}

async function request(path, init = {}) {
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
  if (res.status === 204) return undefined
  return res.json()
}

export function login(code) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ code }),
  })
}

export function getEvents() {
  return request("/api/events")
}

export function getEvent(id) {
  return request(`/api/events/${id}`)
}

export function registerAttendance(eventId, name, status, memo) {
  return request(`/api/events/${eventId}/attend`, {
    method: "POST",
    body: JSON.stringify({ name, status, memo: memo || null }),
  })
}

export function updateAttendance(eventId, attendanceId, name, status, memo) {
  return request(`/api/events/${eventId}/attend/${attendanceId}`, {
    method: "PUT",
    body: JSON.stringify({ name, status, memo: memo || null }),
  })
}

export function deleteAttendance(eventId, attendanceId) {
  return request(`/api/events/${eventId}/attend/${attendanceId}`, { method: "DELETE" })
}

export function createEvent(data) {
  return request("/api/events", { method: "POST", body: JSON.stringify(data) })
}

export function updateEvent(id, data) {
  return request(`/api/events/${id}`, { method: "PUT", body: JSON.stringify(data) })
}

export function deleteEvent(id) {
  return request(`/api/events/${id}`, { method: "DELETE" })
}

export function getCodes() {
  return request("/api/settings/codes")
}

export function updateCodes(data) {
  return request("/api/settings/codes", { method: "PUT", body: JSON.stringify(data) })
}

export function generateAnnouncement({ title, location, description, event_year, event_month, event_day, event_hour, event_minute }) {
  return request("/api/events/generate-announcement", {
    method: "POST",
    body: JSON.stringify({ title, location: location || null, description: description || null, event_year, event_month, event_day, event_hour, event_minute }),
  })
}

export function generateSummary(eventId) {
  return request(`/api/events/${eventId}/generate-summary`, { method: "POST" })
}
