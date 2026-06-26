from pydantic import BaseModel

class ProductCreate(BaseModel):
    subcategory_id: int
    name: str
    description: str
    price: float
    stock: int
    image: str