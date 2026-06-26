from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.database.models import Cart, CartItem, Product

from app.schemas.cart import AddToCart
from app.auth.dependencies import get_current_user

from app.database.models import (
    Cart,
    CartItem,
    Product
)
from app.schemas.cart import (
    AddToCart,
    UpdateCartQuantity
)

router = APIRouter(
    prefix="/cart",
    tags=["Cart"]
)

@router.post("/add")
def add_to_cart(
    data: AddToCart,
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

    cart = db.query(Cart).filter(
        Cart.user_id == current_user.id
    ).first()

    if not cart:
        cart = Cart(
            user_id=current_user.id
        )
        db.add(cart)
        db.commit()
        db.refresh(cart)

    cart_item = CartItem(
        cart_id=cart.id,
        product_id=data.product_id,
        quantity=data.quantity
    )

    db.add(cart_item)
    db.commit()

    return {
        "message": "Product Added To Cart"
    }

@router.get("/")
def view_cart(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    cart = db.query(Cart).filter(
        Cart.user_id == current_user.id
    ).first()

    if not cart:
        return {
            "message": "Cart Empty"
        }

    cart_items = db.query(CartItem).filter(
        CartItem.cart_id == cart.id
    ).all()

    data = []

    for item in cart_items:

        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        data.append({
            "cart_item_id": item.id,
            "product_id": product.id,
            "name": product.name,
            "price": product.price,
            "image": product.image,
            "quantity": item.quantity
        })

    return data

@router.delete("/remove/{cart_item_id}")
def remove_from_cart(
    cart_item_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    print("DELETE ID =", cart_item_id)

    item = db.query(CartItem).filter(
        CartItem.id == cart_item_id
    ).first()

    print("ITEM =", item)

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Cart Item Not Found"
        )

    db.delete(item)
    db.commit()

    return {
        "message": "Item Removed From Cart"
    }

@router.put("/update/{cart_item_id}")
def update_cart_quantity(
    cart_item_id: int,
    data: UpdateCartQuantity,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    if data.quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than 0"
        )

    cart = db.query(Cart).filter(
        Cart.user_id == current_user.id
    ).first()

    if not cart:
        raise HTTPException(
            status_code=404,
            detail="Cart Not Found"
        )

    item = db.query(CartItem).filter(
        CartItem.id == cart_item_id,
        CartItem.cart_id == cart.id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Cart Item Not Found"
        )

    item.quantity = data.quantity

    db.commit()
    db.refresh(item)

    return {
        "message": "Quantity Updated",
        "cart_item_id": item.id,
        "quantity": item.quantity
    }