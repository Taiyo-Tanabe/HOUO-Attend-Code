import os
from datetime import datetime, timedelta, timezone
from typing import Literal
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt

MEMBER_CODE = os.environ["MEMBER_CODE"]
ADMIN_CODE = os.environ["ADMIN_CODE"]
JWT_SECRET = os.environ["JWT_SECRET"]
ALGORITHM = "HS256"
TOKEN_EXPIRE_DAYS = 7

bearer = HTTPBearer()


def create_token(role: Literal["member", "admin"]) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=TOKEN_EXPIRE_DAYS)
    return jwt.encode({"role": role, "exp": expire}, JWT_SECRET, algorithm=ALGORITHM)


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(bearer)) -> dict:
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="無効なトークンです")


def require_member(payload: dict = Depends(verify_token)) -> dict:
    if payload.get("role") not in ("member", "admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="メンバー権限が必要です")
    return payload


def require_admin(payload: dict = Depends(verify_token)) -> dict:
    if payload.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="管理者権限が必要です")
    return payload
