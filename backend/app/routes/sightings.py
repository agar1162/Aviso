from supabase_client import create_client
from fastapi import FastAPI, UploadFile, File, HTTPException, APIRouter, Response, status
import io
import os
from pathlib import Path
from dotenv import load_dotenv

url=os.getenv("SUPABASE_URL")
key=os.getenv("SUPABASE_KEY")
BUCKET_NAME=os.getenv("SUPABASE_BUCKET")


supabase = create_client(url, key)
router = APIRouter()


@router.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        supabase.storage.from_(BUCKET_NAME).upload(
            f"images/{file.filename}",
            contents,
            {"content-type": file.content_type}
        )
        return Response(
            content='{"message":"Upload successful!"}',
            media_type="application/json",
            status_code=status.HTTP_201_CREATED
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
