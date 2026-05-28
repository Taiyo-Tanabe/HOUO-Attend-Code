import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine, SessionLocal
from models import Setting
from routers import events, auth, settings

Base.metadata.create_all(bind=engine)


def seed_settings():
    db = SessionLocal()
    try:
        if not db.get(Setting, "member_code"):
            db.add(Setting(key="member_code", value=os.environ["MEMBER_CODE"]))
        if not db.get(Setting, "admin_code"):
            db.add(Setting(key="admin_code", value=os.environ["ADMIN_CODE"]))
        db.commit()
    finally:
        db.close()


seed_settings()

app = FastAPI(title="法桜交流会 イベント管理API")

origins = os.getenv("CORS_ORIGINS", "http://localhost:3001").split(",")
wildcard = origins == ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=not wildcard,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(events.router, prefix="/api")
app.include_router(settings.router, prefix="/api")


@app.get("/")
def health():
    return {"status": "ok"}
