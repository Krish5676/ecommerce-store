from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.database.models import (
    Category,
    SubCategory
)

from app.schemas.category import (
    CategoryCreate,
    SubCategoryCreate
)

router = APIRouter(
    prefix="/categories",
    tags=["Categories"]
)


@router.post("/")
def create_category(
    data: CategoryCreate,
    db: Session = Depends(get_db)
):

    existing = db.query(Category).filter(
        Category.name == data.name
    ).first()

    if existing:
        return {
            "message": "Category Already Exists"
        }

    category = Category(
        name=data.name
    )

    db.add(category)
    db.commit()

    return {
        "message": "Category Created"
    }
@router.get("/")
def get_categories(
    db: Session = Depends(get_db)
):

    return db.query(
        Category
    ).all()
@router.put("/{category_id}")
def update_category(
    category_id: int,
    data: CategoryCreate,
    db: Session = Depends(get_db)
):

    category = db.query(Category).filter(
        Category.id == category_id
    ).first()

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category Not Found"
        )

    category.name = data.name

    db.commit()

    return {
        "message": "Category Updated"
    }
@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db)
):

    category = db.query(Category).filter(
        Category.id == category_id
    ).first()

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category Not Found"
        )

    db.delete(category)
    db.commit()

    return {
        "message": "Category Deleted"
    }

@router.post("/subcategory")
def create_subcategory(
    data: SubCategoryCreate,
    db: Session = Depends(get_db)
):

    existing = db.query(SubCategory).filter(
        SubCategory.category_id == data.category_id,
        SubCategory.name == data.name
    ).first()

    if existing:
        return {
            "message": "SubCategory Already Exists"
        }

    subcategory = SubCategory(
        category_id=data.category_id,
        name=data.name
    )

    db.add(subcategory)
    db.commit()

    return {
        "message": "SubCategory Created"
    }
@router.put("/subcategory/{subcategory_id}")
def update_subcategory(
    subcategory_id: int,
    data: SubCategoryCreate,
    db: Session = Depends(get_db)
):

    subcategory = db.query(SubCategory).filter(
        SubCategory.id == subcategory_id
    ).first()

    if not subcategory:
        raise HTTPException(
            status_code=404,
            detail="SubCategory Not Found"
        )

    subcategory.category_id = data.category_id
    subcategory.name = data.name

    db.commit()

    return {
        "message": "SubCategory Updated"
    }
@router.delete("/subcategory/{subcategory_id}")
def delete_subcategory(
    subcategory_id: int,
    db: Session = Depends(get_db)
):

    subcategory = db.query(SubCategory).filter(
        SubCategory.id == subcategory_id
    ).first()

    if not subcategory:
        raise HTTPException(
            status_code=404,
            detail="SubCategory Not Found"
        )

    db.delete(subcategory)
    db.commit()

    return {
        "message": "SubCategory Deleted"
    }
@router.get("/subcategories/{category_id}")
def get_subcategories_by_category(
    category_id: int,
    db: Session = Depends(get_db)
):

    return db.query(SubCategory).filter(
        SubCategory.category_id == category_id
    ).all()