from pydantic import BaseModel


class CategoryCreate(BaseModel):
    name: str


class SubCategoryCreate(BaseModel):
    category_id: int
    name: str