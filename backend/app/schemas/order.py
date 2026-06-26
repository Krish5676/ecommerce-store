from pydantic import BaseModel
from datetime import datetime


class OrderResponse(BaseModel):
    order_id: int
    total_amount: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True