from sqlalchemy import Column, Integer, String, Time, Date, ForeignKey
from datetime import datetime
from app.database import Base

class Post(Base):
    __tablename__ = "Posts"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True) 
    time = Column(Time)
    date = Column(Date)
    title = Column(String)
    city = Column(String)
    county = Column(String)
    desc = Column(String)
    image_url = Column(String)



class Vote(Base):
    __tablename__ = "Votes"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    post_id = Column(Integer, ForeignKey("Posts.id"), nullable=False)
    vote_type = Column(String, nullable=False)
    device_id = Column(String, nullable=False)
    created_at = Column(Date, default=lambda: datetime.utcnow().date())

