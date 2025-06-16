from datetime import date, time
from pydantic import BaseModel
from typing import Optional, Literal

class PostSchema(BaseModel):
    id: int
    time: time
    date: date
    title: str
    city: str
    county: str
    desc: str
    image_url: str


    model_config = {
        "from_attributes": True
    }

class PostCreate(BaseModel):
    time: time
    date: date
    title: str
    city: str
    county: str
    desc: str
    image_url: str

class VoteCreate(BaseModel):
    post_id: int
    vote_type: Literal["Confirm", "Deny"]
    device_id: str 

