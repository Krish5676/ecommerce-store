from fastapi import APIRouter
from sqlalchemy.orm import Session
from fastapi import Depends
from app.schemas.user import (
    UserSignup,
    UserLogin
)
from app.database.db import get_db
from app.database.models import User
from app.auth.password import (
    hash_password,
    verify_password
)
from app.auth.jwt_handler import (
    create_access_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/signup")
def signup(
    user: UserSignup,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        return {
            "message":
            "Email already registered"
        }

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        password=hash_password(
            user.password
        )
    )

    db.add(new_user)
    db.commit()

    return {
        "message":
        "Signup Successful"
    }


@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:
        return {
            "message":
            "Invalid Email"
        }

    if not verify_password(
        user.password,
        db_user.password
    ):
        return {
            "message":
            "Invalid Password"
        }

    token = create_access_token({
        "user_id": db_user.id
    })

    return {
        "access_token": token
    }