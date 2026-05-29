import bcrypt
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Setting
from schemas import CodesResponse, CodesUpdate
from auth import require_admin

router = APIRouter(tags=["settings"])


def hash_code(code: str) -> str:
    return bcrypt.hashpw(code.encode(), bcrypt.gensalt()).decode()


@router.get("/settings/codes", response_model=CodesResponse)
def get_codes(db: Session = Depends(get_db), _=Depends(require_admin)):
    member = db.get(Setting, "member_code")
    admin = db.get(Setting, "admin_code")
    if not member or not admin:
        raise HTTPException(status_code=500, detail="設定が見つかりません")
    # ハッシュ化済みのため元のコードは返せない
    return CodesResponse(member_code="", admin_code="")


@router.put("/settings/codes", response_model=CodesResponse)
def update_codes(body: CodesUpdate, db: Session = Depends(get_db), _=Depends(require_admin)):
    if body.member_code is not None and body.member_code.strip():
        db.get(Setting, "member_code").value = hash_code(body.member_code.strip())
    if body.admin_code is not None and body.admin_code.strip():
        db.get(Setting, "admin_code").value = hash_code(body.admin_code.strip())
    db.commit()
    return CodesResponse(member_code="", admin_code="")
