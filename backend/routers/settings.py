from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Setting
from schemas import CodesResponse, CodesUpdate
from auth import require_admin

router = APIRouter(tags=["settings"])


@router.get("/settings/codes", response_model=CodesResponse)
def get_codes(db: Session = Depends(get_db), _=Depends(require_admin)):
    member = db.get(Setting, "member_code")
    admin = db.get(Setting, "admin_code")
    if not member or not admin:
        raise HTTPException(status_code=500, detail="設定が見つかりません")
    return CodesResponse(member_code=member.value, admin_code=admin.value)


@router.put("/settings/codes", response_model=CodesResponse)
def update_codes(body: CodesUpdate, db: Session = Depends(get_db), _=Depends(require_admin)):
    if body.member_code is not None:
        setting = db.get(Setting, "member_code")
        setting.value = body.member_code.strip()
    if body.admin_code is not None:
        setting = db.get(Setting, "admin_code")
        setting.value = body.admin_code.strip()
    db.commit()
    member = db.get(Setting, "member_code")
    admin = db.get(Setting, "admin_code")
    return CodesResponse(member_code=member.value, admin_code=admin.value)
