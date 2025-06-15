from sqlalchemy import Column, Integer, String, Time, Date
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

