import os
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import nullslast
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import Event, Attendance
from schemas import EventCreate, EventUpdate, EventOut, EventDetail, AttendanceCreate, AttendanceOut, build_date_display
from auth import require_member

router = APIRouter(tags=["events"])


class AnnouncementRequest(BaseModel):
    title: str
    location: str | None = None
    description: str | None = None
    event_year: int | None = None
    event_month: int | None = None
    event_day: int | None = None
    event_hour: int | None = None
    event_minute: int | None = None


class TextResponse(BaseModel):
    text: str


def _get_anthropic_client():
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY が設定されていません")
    from anthropic import Anthropic
    return Anthropic(api_key=api_key)


def _out(event: Event) -> EventOut:
    attending_count = sum(1 for a in event.attendances if a.status == "attending")
    return EventOut.model_validate({**event.__dict__, "attending_count": attending_count})


@router.post("/events/generate-announcement", response_model=TextResponse)
def generate_announcement(body: AnnouncementRequest, _=Depends(require_member)):
    client = _get_anthropic_client()
    date_display = build_date_display(
        body.event_year, body.event_month, body.event_day,
        body.event_hour, body.event_minute,
    )
    parts = [f"イベント名：{body.title}"]
    if date_display != "日時未定":
        parts.append(f"日時：{date_display}")
    if body.location:
        parts.append(f"場所：{body.location}")
    if body.description:
        parts.append(f"備考：{body.description}")
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=600,
        messages=[{
            "role": "user",
            "content": (
                "以下のイベント情報をもとに、LINEグループで送れる短い告知文を日本語で作成してください。\n"
                "情報が少なくても、与えられた内容だけで必ず告知文を完成させてください。\n"
                "追加情報を求めたり、テンプレートを返したりしないでください。\n\n"
                + "\n".join(parts)
            ),
        }],
    )
    return TextResponse(text=message.content[0].text)


@router.get("/events", response_model=list[EventOut])
def list_events(db: Session = Depends(get_db), _=Depends(require_member)):
    events = db.query(Event).order_by(
        nullslast(Event.event_year.asc()),
        nullslast(Event.event_month.asc()),
        nullslast(Event.event_day.asc()),
        nullslast(Event.event_hour.asc()),
        nullslast(Event.event_minute.asc()),
    ).all()
    return [_out(e) for e in events]


@router.get("/events/{event_id}", response_model=EventDetail)
def get_event(event_id: str, db: Session = Depends(get_db), _=Depends(require_member)):
    event = db.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="イベントが見つかりません")
    attending_count = sum(1 for a in event.attendances if a.status == "attending")
    return EventDetail.model_validate({
        **event.__dict__,
        "attending_count": attending_count,
        "attendances": [AttendanceOut.model_validate(a) for a in event.attendances],
    })


@router.post("/events/{event_id}/attend", response_model=AttendanceOut, status_code=status.HTTP_201_CREATED)
def register_attendance(event_id: str, body: AttendanceCreate, db: Session = Depends(get_db), _=Depends(require_member)):
    if not db.get(Event, event_id):
        raise HTTPException(status_code=404, detail="イベントが見つかりません")
    attendance = Attendance(event_id=event_id, name=body.name, status=body.status, memo=body.memo)
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return AttendanceOut.model_validate(attendance)


@router.put("/events/{event_id}/attend/{attendance_id}", response_model=AttendanceOut)
def update_attendance(event_id: str, attendance_id: str, body: AttendanceCreate, db: Session = Depends(get_db), _=Depends(require_member)):
    attendance = db.get(Attendance, attendance_id)
    if not attendance or attendance.event_id != event_id:
        raise HTTPException(status_code=404, detail="出欠が見つかりません")
    attendance.name = body.name
    attendance.status = body.status
    attendance.memo = body.memo
    db.commit()
    db.refresh(attendance)
    return AttendanceOut.model_validate(attendance)


@router.delete("/events/{event_id}/attend/{attendance_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_attendance(event_id: str, attendance_id: str, db: Session = Depends(get_db), _=Depends(require_member)):
    attendance = db.get(Attendance, attendance_id)
    if not attendance or attendance.event_id != event_id:
        raise HTTPException(status_code=404, detail="出欠が見つかりません")
    db.delete(attendance)
    db.commit()


@router.post("/events", response_model=EventOut, status_code=status.HTTP_201_CREATED)
def create_event(body: EventCreate, db: Session = Depends(get_db), _=Depends(require_member)):
    event = Event(**body.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    return _out(event)


@router.put("/events/{event_id}", response_model=EventOut)
def update_event(event_id: str, body: EventUpdate, db: Session = Depends(get_db), _=Depends(require_member)):
    event = db.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="イベントが見つかりません")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(event, field, value)
    db.commit()
    db.refresh(event)
    return _out(event)


@router.delete("/events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: str, db: Session = Depends(get_db), _=Depends(require_member)):
    event = db.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="イベントが見つかりません")
    db.delete(event)
    db.commit()


