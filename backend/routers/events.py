from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import nullslast
from sqlalchemy.orm import Session
from database import get_db
from models import Event, Attendance
from schemas import EventCreate, EventUpdate, EventOut, EventDetail, AttendanceCreate, AttendanceOut
from auth import require_member

router = APIRouter(tags=["events"])


def _out(event: Event) -> EventOut:
    attending_count = sum(1 for a in event.attendances if a.status == "attending")
    return EventOut.model_validate({**event.__dict__, "attending_count": attending_count})


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
