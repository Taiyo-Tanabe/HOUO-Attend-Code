import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Setting
from schemas import CodeRequest, TokenResponse
from auth import create_token

router = APIRouter(tags=["auth"])


@router.post("/auth/login", response_model=TokenResponse)
def login(body: CodeRequest, db: Session = Depends(get_db)):
    member_setting = db.get(Setting, "member_code")
    admin_setting = db.get(Setting, "admin_code")

    code = body.code.encode()
    if bcrypt.checkpw(code, admin_setting.value.encode()):
        return TokenResponse(token=create_token("admin"), role="admin")
    if bcrypt.checkpw(code, member_setting.value.encode()):
        return TokenResponse(token=create_token("member"), role="member")
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="コードが違います")
