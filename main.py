from fastapi import FastAPI, Request, HTTPException
from route_handler import get_routes_safe
from emissions import calculate_emissions

app = FastAPI()

def get_eco_tag(emission_level: str) -> str:
    """
    Convert emission level to eco-friendliness tag.
    
    Args:
        emission_level: The emission level from calculate_emissions
        
    Returns:
        str: Eco-friendliness tag
    """
    if emission_level == "low":
        return "eco_friendly"
    elif emission_level == "medium":
        return "mid"
    else:  # high
        return "non_eco"

@app.post("/route-options")
async def route_options(request: Request):
    try:
        body = await request.json()
        source = body.get("source")     # [lng, lat]
        destination = body.get("destination")
        
        # Validate required fields
        if not source or not destination:
            raise HTTPException(status_code=400, detail="Both source and destination coordinates are required")
        
        # Get routes using safe wrapper
        route_result = get_routes_safe(source, destination)
        
        if not route_result["success"]:
            raise HTTPException(status_code=400, detail=route_result["error"])
        
        raw_routes = route_result["data"]
        route_data = []

        for feature in raw_routes["features"]:
            summary = feature["properties"]["summary"]
            dist_km = summary["distance"] / 1000
            dur_min = summary["duration"] / 60
            emissions_data = calculate_emissions(dist_km)

            route_data.append({
                "distance_km": round(dist_km, 2),
                "duration_min": round(dur_min, 2),
                "emissions_grams": emissions_data["emissions_grams"],
                "emission_level": emissions_data["emission_level"],
                "eco_tag": get_eco_tag(emissions_data["emission_level"])
            })

        # Sort routes by emissions (lowest to highest)
        route_data.sort(key=lambda x: x["emissions_grams"])
        
        return {"routes": route_data}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
