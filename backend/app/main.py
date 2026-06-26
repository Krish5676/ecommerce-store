from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from app.database.db import engine
from app.database.models import Base
from fastapi.staticfiles import StaticFiles

from app.routes.auth import router as auth_router
from app.routes.users import router as users_router
from app.routes.categories import router as category_router
from app.routes.products import router as products_router
from app.routes.cart import router as cart_router
from app.routes.orders import router as orders_router
from app.routes.address import router as address_router
from app.routes.wishlist import router as wishlist_router
from app.routes.upload import router as upload_router
from app.database.models import Order, OrderItem
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Ecommerce API")

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(category_router)
app.include_router(products_router)
app.include_router(cart_router)
app.include_router(orders_router)
app.include_router(address_router)
app.include_router(wishlist_router)
app.include_router(upload_router)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)
app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)
@app.get("/")
def home():
    return {"message": "Ecommerce Backend Running"}