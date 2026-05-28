from datetime import datetime, date as _date
from typing import Literal
from pydantic import BaseModel, model_validator


# ── 出欠 ────────────────────────────────────────────────────────

AttendanceStatus = Literal["attending", "not_attending", "undecided"]


class AttendanceCreate(BaseModel):
    name: str
    status: AttendanceStatus
    memo: str | None = None


class AttendanceOut(BaseModel):
    id: str
    name: str
    status: AttendanceStatus
    memo: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


# ── イベント ─────────────────────────────────────────────────────

WEEKDAYS = ["月", "火", "水", "木", "金", "土", "日"]


def build_date_display(year: int|None, month: int|None, day: int|None, hour: int|None, minute: int|None) -> str:
    parts: list[str] = []
    if year:  parts.append(f"{year}年")
    if month: parts.append(f"{month}月")
    if day:   parts.append(f"{day}日")
    if year and month and day:
        try:
            wd = _date(year, month, day).weekday()
            parts.append(f"（{WEEKDAYS[wd]}）")
        except ValueError:
            pass
    if hour is not None:
        parts.append(f" {hour:02d}:{minute or 0:02d}")
    return "".join(parts) or "日時未定"


class EventCreate(BaseModel):
    title: str
    description: str | None = None
    location: str | None = None
    event_year:   int | None = None
    event_month:  int | None = None
    event_day:    int | None = None
    event_hour:   int | None = None
    event_minute: int | None = None


class EventUpdate(BaseModel):
    title:        str | None = None
    description:  str | None = None
    location:     str | None = None
    event_year:   int | None = None
    event_month:  int | None = None
    event_day:    int | None = None
    event_hour:   int | None = None
    event_minute: int | None = None


class EventOut(BaseModel):
    id: str
    title: str
    description:  str | None
    location:     str | None
    event_year:   int | None
    event_month:  int | None
    event_day:    int | None
    event_hour:   int | None
    event_minute: int | None
    date_display: str = ""
    created_at:   datetime
    attending_count: int = 0

    model_config = {"from_attributes": True}

    @model_validator(mode="after")
    def set_date_display(self):
        self.date_display = build_date_display(
            self.event_year, self.event_month, self.event_day,
            self.event_hour, self.event_minute,
        )
        return self


class EventDetail(EventOut):
    attendances: list[AttendanceOut] = []


# ── 認証 ─────────────────────────────────────────────────────────

class CodeRequest(BaseModel):
    code: str


class TokenResponse(BaseModel):
    token: str
    role: Literal["member", "admin"]


# ── 設定 ─────────────────────────────────────────────────────────

class CodesResponse(BaseModel):
    member_code: str
    admin_code: str


class CodesUpdate(BaseModel):
    member_code: str | None = None
    admin_code: str | None = None
