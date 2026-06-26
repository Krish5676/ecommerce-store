from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.auth.dependencies import get_current_user

from app.database.models import (
    Wishlist,
    Product
)

from app.schemas.wishlist import WishlistCreate

router = APIRouter(
    prefix="/wishlist",
    tags=["Wishlist"]
)


@router.post("/add")
def add_to_wishlist(
    data: WishlistCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    product = db.query(Product).filter(
        Product.id == data.product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product Not Found"
        )

    item = Wishlist(
        user_id=current_user.id,
        product_id=data.product_id
    )

    db.add(item)
    db.commit()

    return {
        "message": "Added To Wishlist"
    }


@router.get("/")
def get_wishlist(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    items = db.query(Wishlist).filter(
        Wishlist.user_id == current_user.id
    ).all()

    data = []

    for item in items:

        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        data.append({
            "wishlist_id": item.id,
            "product_id": product.id,
            "name": product.name,
            "price": product.price,
            "image": product.image
        })

    return data


@router.delete("/{wishlist_id}")
def remove_wishlist(
    wishlist_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    item = db.query(Wishlist).filter(
        Wishlist.id == wishlist_id,
        Wishlist.user_id == current_user.id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Wishlist Item Not Found"
        )

    db.delete(item)
    db.commit()

    return {
        "message": "Removed From Wishlist"
    }
@router.put("/update/{wishlist_id}")
def update_wishlist(
    wishlist_id: int,
    product_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    wishlist = db.query(Wishlist).filter(
        Wishlist.id == wishlist_id,
        Wishlist.user_id == current_user.id
    ).first()

    if not wishlist:
        raise HTTPException(
            status_code=404,
            detail="Wishlist Item Not Found"
        )

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product Not Found"
        )

    wishlist.product_id = product_id

    db.commit()

    return {
        "message": "Wishlist Updated Successfully"
    }