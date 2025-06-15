from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models, schemas
from app.schemas import PostSchema, PostCreate
from datetime import datetime
import os


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
BUCKET_NAME = os.getenv("SUPABASE_BUCKET")


router = APIRouter()

def get_public_url(image_path: str) -> str:
    return f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}/images/{image_path}"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/posts", response_model=list[schemas.PostSchema])
def get_posts(
    county: str = Query(None),  
    date: str = Query(None), 
    db: Session = Depends(get_db)
):
    query = db.query(models.Post)

    if county:
        query = query.filter(models.Post.county == county)

    if date:
        try:
            filter_date = datetime.strptime(date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

        query = query.filter(models.Post.date > filter_date)
    
    posts = query.all()
    
    posts_with_url = []
    for post in posts:
        post_data = schemas.PostSchema.from_orm(post)
        if post.image_url:
            post_data.image_url = get_public_url(post.image_url)
        posts_with_url.append(post_data)
    return posts_with_url


@router.post("/posts", response_model=PostSchema, status_code=201)
def create_post(post: PostCreate, db: Session = Depends(get_db)):
    db_post = models.Post(**post.dict())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post
