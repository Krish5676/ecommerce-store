from fastapi import APIRouter
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.database.db import get_db

from app.auth.dependencies import get_current_user

from app.database.models import (
    Cart,
    CartItem,
    Product,
    Order,
    OrderItem
)

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)
@router.post("/checkout")
def checkout(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    cart = db.query(Cart).filter(
        Cart.user_id == current_user.id
    ).first()

    if not cart:
        raise HTTPException(
            status_code=404,
            detail="Cart Not Found"
        )

    cart_items = db.query(CartItem).filter(
        CartItem.cart_id == cart.id
    ).all()

    if not cart_items:
        raise HTTPException(
            status_code=400,
            detail="Cart Empty"
        )

    total_amount = 0

    order = Order(
        user_id=current_user.id,
        total_amount=0,
        status="Pending"
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    for item in cart_items:

        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        total_amount += product.price * item.quantity

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=item.quantity,
            price=product.price
        )

        db.add(order_item)

    order.total_amount = total_amount

    for item in cart_items:
        db.delete(item)

    db.commit()

    return {
        "message": "Order Placed Successfully",
        "order_id": order.id,
        "total_amount": total_amount
    }

@router.get("/")
def get_my_orders(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    orders = db.query(Order).filter(
        Order.user_id == current_user.id
    ).all()

    data = []

    for order in orders:
        data.append({
            "order_id": order.id,
            "total_amount": order.total_amount,
            "status": order.status,
            "created_at": order.created_at
        })

    return data

@router.get("/{order_id}")
def get_order_details(
    order_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order Not Found"
        )

    items = db.query(OrderItem).filter(
        OrderItem.order_id == order.id
    ).all()

    return {
        "order_id": order.id,
        "total_amount": order.total_amount,
        "status": order.status,
        "items": items
    }

@router.put("/status/{order_id}")
def update_order_status(
    order_id: int,
    status: str,
    db: Session = Depends(get_db)
):

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order Not Found"
        )

    order.status = status

    db.commit()
    db.refresh(order)

    return {
        "message": "Order Status Updated",
        "status": order.status
    }

@router.delete("/{order_id}/item/{item_id}")
def remove_order_item(
    order_id: int,
    item_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order Not Found"
        )

    if order.status != "Pending":
        raise HTTPException(
            status_code=400,
            detail="Only Pending Orders Can Be Modified"
        )

    item = db.query(OrderItem).filter(
        OrderItem.id == item_id,
        OrderItem.order_id == order_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Order Item Not Found"
        )

    order.total_amount -= (
        item.price * item.quantity
    )

    db.delete(item)
    db.commit()

    return {
        "message": "Product Removed From Order",
        "new_total": order.total_amount
    }   
@router.put("/return/{order_id}")
def return_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order Not Found"
        )

    if order.status != "Delivered":
        raise HTTPException(
            status_code=400,
            detail="Only Delivered Orders Can Be Returned"
        )

    order.status = "Return Requested"

    db.commit()

    return {
        "message": "Return Request Submitted Successfully",
        "order_id": order.id,
        "status": order.status
    }

@router.put("/cancel/{order_id}")
def cancel_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order Not Found"
        )

    if order.status != "Pending":
        raise HTTPException(
            status_code=400,
            detail="Only Pending Orders Can Be Cancelled"
        )

    order.status = "Cancelled"

    db.commit()

    return {
        "message": "Order Cancelled Successfully"
    }

@router.delete("/{order_id}")
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order Not Found"
        )

    db.query(OrderItem).filter(
        OrderItem.order_id == order_id
    ).delete()

    db.delete(order)

    db.commit()

    return {
        "message": "Order Deleted Successfully"
    }

