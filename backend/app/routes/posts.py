from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models, schemas
from app.schemas import PostSchema, PostCreate


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/posts", response_model=list[schemas.PostSchema])
def get_posts(db: Session = Depends(get_db)):
    return db.query(models.Post).all()


@router.post("/posts", response_model=PostSchema, status_code=201)
def create_post(post: PostCreate, db: Session = Depends(get_db)):
    db_post = models.Post(**post.dict())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post
