from supabase import create_client
from fastapi import FastAPI, UploadFile, File, HTTPException, APIRouter
from supabase import create_client
import io
import os

url= os.getenv(SUPABASE_URL)
key=os.getenv(SUPABASE_KEY)
BUCKET_NAME = os.getenv(SUPABASE_BUCKET)


supabase = create_client(url, key)
router = APIRouter()


@router.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()  # Read file bytes
        # Upload to Supabase storage
        response = supabase.storage.from_(BUCKET_NAME).upload(
            f"images/{file.filename}",
            io.BytesIO(contents),
            {"content-type": file.content_type}
        )
        if response.get("error"):
            raise HTTPException(status_code=400, detail=response["error"]["message"])
        return {"message": "Upload successful!", "path": response["path"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))