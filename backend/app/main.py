from fastapi import FastAPI
from app.routes import posts
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(posts.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"message": "Hello, world!"}