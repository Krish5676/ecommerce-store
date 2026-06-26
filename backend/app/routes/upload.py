from fastapi import APIRouter, UploadFile, File
import shutil
import os

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)

@router.post("/product-image")
def upload_product_image(
    file: UploadFile = File(...)
):

    upload_dir = "uploads/products"

    os.makedirs(upload_dir, exist_ok=True)

    file_path = f"{upload_dir}/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    return {
        "message": "Image Uploaded",
        "image_url": f"/uploads/products/{file.filename}"
    }