from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Any, Dict

app = FastAPI()

class GeoJSON(BaseModel):
    type: str
    features: list[Dict[str, Any]]

@app.post("/geojson/")
async def receive_geojson(data: GeoJSON):
    if data.type != "FeatureCollection":
        raise HTTPException(status_code=400, detail="Invalid GeoJSON type")
    # Aqui você pode processar os dados do GeoJSON conforme necessário
    return {"message": "GeoJSON received successfully", "data": data}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
