from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.auth.dependencies import get_current_user

from app.database.models import Address
from app.schemas.address import AddressCreate

router = APIRouter(
    prefix="/addresses",
    tags=["Addresses"]
)


@router.post("/")
def create_address(
    data: AddressCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    address = Address(
        user_id=current_user.id,
        full_name=data.full_name,
        phone=data.phone,
        address=data.address,
        city=data.city,
        state=data.state,
        pincode=data.pincode
    )

    db.add(address)
    db.commit()

    return {
        "message": "Address Added"
    }


@router.get("/")
def get_addresses(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return db.query(Address).filter(
        Address.user_id == current_user.id
    ).all()


@router.delete("/{address_id}")
def delete_address(
    address_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    address = db.query(Address).filter(
        Address.id == address_id,
        Address.user_id == current_user.id
    ).first()

    if not address:
        raise HTTPException(
            status_code=404,
            detail="Address Not Found"
        )

    db.delete(address)
    db.commit()

    return {
        "message": "Address Deleted"
    }
@router.put("/update/{address_id}")
def update_address(
    address_id: int,
    data: AddressCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    address = db.query(Address).filter(
        Address.id == address_id,
        Address.user_id == current_user.id
    ).first()

    if not address:
        raise HTTPException(
            status_code=404,
            detail="Address Not Found"
        )

    address.full_name = data.full_name
    address.phone = data.phone
    address.address = data.address
    address.city = data.city
    address.state = data.state
    address.pincode = data.pincode

    db.commit()

    return {
        "message": "Address Updated Successfully"
    }