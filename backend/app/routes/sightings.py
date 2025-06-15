from supabase import create_client
from fastapi import FastAPI, UploadFile, File, HTTPException, APIRouter
from supabase import create_client
import io

url="https://lcbhlyczbborswmwkkwg.supabase.co"
key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjYmhseWN6YmJvcnN3bXdra3dnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTcwNDQ0MSwiZXhwIjoyMDY1MjgwNDQxfQ.P1pxnG8czxohBcBhQ2Y5QfDfW6S-k8iwkCrNEDSx85w"
BUCKET_NAME = "sightings"


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