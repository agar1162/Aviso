from fastapi import FastAPI, Query, HTTPException
from app.routes import posts, sightings, votes
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI()
app.include_router(posts.router)
app.include_router(sightings.router) 
app.include_router(votes.router) 


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/county")
async def get_counties(state: str = Query(...)):
    normalized_state = state.strip().title()

    url = (
        f"https://public.opendatasoft.com/api/records/1.0/search/"
        f"?dataset=us-county-boundaries&q=&rows=1000"
        f"&facet=state_name&refine.state_name={normalized_state}"
    )

    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        if resp.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to fetch data")

        data = resp.json()
        counties = [rec["fields"]["name"] for rec in data.get("records", [])]

    if not counties:
        raise HTTPException(status_code=404, detail="No counties found")

    return {"counties": sorted(counties)}