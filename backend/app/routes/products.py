from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.database.models import Product

from app.schemas.product import ProductCreate

from sqlalchemy import or_

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import Boolean
from app.auth.admin import admin_required

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

@router.post("/")
def create_product(
    data: ProductCreate,
    db: Session = Depends(get_db)
):

    existing_product = db.query(Product).filter(
        Product.name == data.name,
        Product.subcategory_id == data.subcategory_id
    ).first()

    if existing_product:
        return {
            "message": "Product Already Exists"
        }

    product = Product(
        subcategory_id=data.subcategory_id,
        name=data.name,
        description=data.description,
        price=data.price,
        stock=data.stock,
        image=data.image
    )

    db.add(product)
    db.commit()

    return {
        "message": "Product Created"
    }
@router.get("/")
def get_products(
    db: Session = Depends(get_db)
):
    return db.query(Product).filter(
        Product.is_active == True
    ).all()

@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        return {"message": "Product Not Found"}

    return product

@router.get("/search/{keyword}")
def search_products(
    keyword: str,
    db: Session = Depends(get_db)
):

    products = db.query(Product).filter(
        Product.name.ilike(f"%{keyword}%")
    ).all()

    return products

@router.put("/{product_id}")
def update_product(
    product_id: int,
    data: ProductCreate,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product Not Found"
        )

    product.subcategory_id = data.subcategory_id
    product.name = data.name
    product.description = data.description
    product.price = data.price
    product.stock = data.stock
    product.image = data.image

    db.commit()

    return {
        "message": "Product Updated"
    }

@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product Not Found"
        )

    db.delete(product)
    db.commit()

    return {
        "message": "Product Deleted"
    }
@router.put("/deactivate/{product_id}")
def deactivate_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product Not Found"
        )

    product.is_active = False

    db.commit()

    return {
        "message": "Product Deactivated"
    }
@router.put("/activate/{product_id}")
def activate_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product Not Found"
        )

    product.is_active = True

    db.commit()

    return {
        "message": "Product Activated"
    }