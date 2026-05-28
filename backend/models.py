import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, DateTime, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base


class Setting(Base):
    __tablename__ = "settings"

    key:   Mapped[str] = mapped_column(String, primary_key=True)
    value: Mapped[str] = mapped_column(String, nullable=False)


class Event(Base):
    __tablename__ = "events"

    id:          Mapped[str]      = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title:       Mapped[str]      = mapped_column(String(100), nullable=False)
    description: Mapped[str|None] = mapped_column(Text, nullable=True)
    location:    Mapped[str|None] = mapped_column(String(200), nullable=True)

    event_year:   Mapped[int|None] = mapped_column(Integer, nullable=True)
    event_month:  Mapped[int|None] = mapped_column(Integer, nullable=True)
    event_day:    Mapped[int|None] = mapped_column(Integer, nullable=True)
    event_hour:   Mapped[int|None] = mapped_column(Integer, nullable=True)
    event_minute: Mapped[int|None] = mapped_column(Integer, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    attendances: Mapped[list["Attendance"]] = relationship("Attendance", back_populates="event", cascade="all, delete-orphan")


class Attendance(Base):
    __tablename__ = "attendances"

    id:       Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    event_id: Mapped[str] = mapped_column(String, ForeignKey("events.id"), nullable=False)
    name:     Mapped[str]      = mapped_column(String(50), nullable=False)
    status:   Mapped[str]      = mapped_column(String(20), nullable=False)
    memo:     Mapped[str|None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    event: Mapped["Event"] = relationship("Event", back_populates="attendances")
