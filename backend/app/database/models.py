from sqlalchemy.orm import relationship
from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    String,
    Boolean,
    DateTime
)

from datetime import datetime
from sqlalchemy import Float
from app.database.db import Base


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String(150))

    email = Column(
        String(200),
        unique=True,
        nullable=False
    )

    phone = Column(
        String(20),
        unique=True
    )

    password = Column(
        String(255),
        nullable=False
    )

    is_verified = Column(
        Boolean,
        default=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
    role = Column(
    String(20),
    default="user"
)

class Category(Base):

    __tablename__ = "categories"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100),
        unique=True,
        nullable=False
    )

    subcategories = relationship(
        "SubCategory",
        back_populates="category"
    )

class SubCategory(Base):

    __tablename__ = "subcategories"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    category_id = Column(
        Integer,
        ForeignKey("categories.id")
    )

    name = Column(
        String(100),
        nullable=False
    )

    category = relationship(
        "Category",
        back_populates="subcategories"
    )

class Product(Base):

    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    subcategory_id = Column(
        Integer,
        ForeignKey("subcategories.id")
    )

    name = Column(String(200))

    description = Column(String(1000))

    price = Column(Float)

    stock = Column(Integer)

    image = Column(String(255))

    is_active = Column(
        Boolean,
        default=True
    )

class Cart(Base):

    __tablename__ = "cart"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )


class CartItem(Base):

    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)

    cart_id = Column(
        Integer,
        ForeignKey("cart.id")
    )

    product_id = Column(
        Integer,
        ForeignKey("products.id")
    )

    quantity = Column(
        Integer,
        default=1
    )

class Order(Base):

    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    total_amount = Column(Float)

    status = Column(
        String(50),
        default="Pending"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

class OrderItem(Base):

    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)

    order_id = Column(
        Integer,
        ForeignKey("orders.id")
    )

    product_id = Column(
        Integer,
        ForeignKey("products.id")
    )

    quantity = Column(Integer)

    price = Column(Float)

class Address(Base):

    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    full_name = Column(String(150))

    phone = Column(String(20))

    address = Column(String(500))

    city = Column(String(100))

    state = Column(String(100))

    pincode = Column(String(20))

class Wishlist(Base):

    __tablename__ = "wishlist"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    product_id = Column(
        Integer,
        ForeignKey("products.id")
    )