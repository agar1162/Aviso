from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Vote, Post
from app.schemas import VoteCreate
from sqlalchemy import func

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/vote")
def submit_vote(vote: VoteCreate, db: Session = Depends(get_db)):
    # Check if device already voted on the post
    existing = db.query(Vote).filter_by(
        post_id=vote.post_id,
        device_id=vote.device_id
    ).first()
    if existing:
        raise HTTPException(status_code=403, detail="Device already voted")

    # Create and add vote
    new_vote = Vote(**vote.dict())
    db.add(new_vote)

    # Update counts in Posts table
    post = db.query(Post).filter(Post.id == vote.post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    db.commit()
    return {"message": "Vote submitted"}


@router.get("/post/{post_id}/vote_counts")
def get_vote_counts(post_id: int, db: Session = Depends(get_db)):
    confirm_count = db.query(func.count(Vote.id)).filter(
        Vote.post_id == post_id,
        Vote.vote_type == "Confirm"
    ).scalar()

    deny_count = db.query(func.count(Vote.id)).filter(
        Vote.post_id == post_id,
        Vote.vote_type == "Deny"
    ).scalar()

    return {"confirm_cnt": confirm_count, "deny_cnt": deny_count}