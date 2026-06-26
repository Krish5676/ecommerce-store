from fastapi import APIRouter
from fastapi import Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database.models import User
from app.database.models import Address
from sqlalchemy.orm import Session
from app.database.db import get_db
from pydantic import BaseModel

class ProfileUpdate(BaseModel):
    name: str
    address: str
class ProfileUpdate(BaseModel):
    name: str
    address: str
from app.auth.dependencies import (
    get_current_user
)

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)
@router.put("/update")
def update_profile(
    data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    current_user.full_name = data.name

    address = db.query(Address).filter(
        Address.user_id == current_user.id
    ).first()

    if address:

        address.address = data.address

    else:

        address = Address(
            user_id=current_user.id,
            full_name=current_user.full_name,
            phone=current_user.phone,
            address=data.address,
            city="",
            state="",
            pincode=""
        )

        db.add(address)

    db.commit()

    return {
        "message": "Profile Updated"
    }
@router.get("/me")
def get_profile(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    address = db.query(Address).filter(
        Address.user_id == current_user.id
    ).first()

    return {
        "id": current_user.id,
        "name": current_user.full_name,
        "email": current_user.email,
        "phone": current_user.phone,
        "address": address.address if address else ""
    }
@router.get("/")
def get_all_users(
    db: Session = Depends(get_db)
):
    return db.query(User).all()