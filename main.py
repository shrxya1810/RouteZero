from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from route_handler import get_routes_safe
from emissions import calculate_emissions
from carrier_selector import match_green_carrier
from eco_points import get_eco_points, get_eco_tag
from reverse_logistics import optimize_reverse_pickup
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

app = FastAPI(title="RouteZero API", description="Eco-friendly route optimization API")

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class RouteExplanationRequest(BaseModel):
    emissions_grams: float
    vehicle_type: str
    duration_min: float

class ReverseLogisticsRequest(BaseModel):
    deliveries: List[Dict[str, Any]]
    returns: List[Dict[str, Any]]

def generate_eco_explanation(emissions_grams: float, vehicle_type: str, duration_min: float) -> dict:
    """
    Generate a natural language explanation of route eco-friendliness.
    
    Args:
        emissions_grams: CO2 emissions in grams
        vehicle_type: Type of vehicle used
        duration_min: Duration in minutes
        
    Returns:
        dict: Contains explanation, eco_score, and recommendations
    """
    # Calculate eco points for context
    eco_points = get_eco_points(emissions_grams)
    
    # Determine emission level
    if emissions_grams <= 50:
        emission_level = "very low"
        eco_status = "excellent"
    elif emissions_grams <= 150:
        emission_level = "low"
        eco_status = "good"
    elif emissions_grams <= 500:
        emission_level = "moderate"
        eco_status = "fair"
    else:
        emission_level = "high"
        eco_status = "poor"
    
    # Vehicle-specific explanations
    vehicle_explanations = {
        "ev": "Electric vehicles produce zero direct emissions, making this route highly eco-friendly.",
        "hybrid": "Hybrid vehicles combine electric and fuel power, significantly reducing emissions compared to traditional vehicles.",
        "car": "Traditional vehicles have higher emissions, but this route may still be reasonable depending on distance.",
        "diesel": "Diesel vehicles typically have higher emissions, but may be necessary for longer distances."
    }
    
    # Duration-based context
    if duration_min <= 15:
        time_context = "This is a quick trip"
    elif duration_min <= 30:
        time_context = "This is a moderate duration trip"
    else:
        time_context = "This is a longer journey"
    
    # Generate explanation based on combination of factors
    if eco_points == 50:
        explanation = f"{time_context} with {emission_level} emissions ({emissions_grams:.1f}g CO2). {vehicle_explanations.get(vehicle_type, 'This vehicle type provides a good balance of efficiency and practicality.')} This route is {eco_status} for the environment."
    elif eco_points == 30:
        explanation = f"{time_context} with {emission_level} emissions ({emissions_grams:.1f}g CO2). {vehicle_explanations.get(vehicle_type, 'This vehicle type offers moderate environmental impact.')} This route has {eco_status} environmental impact."
    else:
        explanation = f"{time_context} with {emission_level} emissions ({emissions_grams:.1f}g CO2). {vehicle_explanations.get(vehicle_type, 'This vehicle type has higher environmental impact.')} Consider greener alternatives for better eco-friendliness."
    
    # Generate recommendations
    recommendations = []
    if eco_points == 0:
        recommendations.append("Consider switching to an electric or hybrid vehicle")
        recommendations.append("Look for shorter route alternatives")
        recommendations.append("Combine this trip with other errands to reduce overall emissions")
    elif eco_points == 30:
        recommendations.append("Consider an electric vehicle for even better eco-friendliness")
        recommendations.append("This is a reasonable environmental choice")
    else:
        recommendations.append("Excellent eco-friendly choice!")
        recommendations.append("This route sets a great example for sustainable transportation")
    
    return {
        "explanation": explanation,
        "eco_score": eco_points,
        "emission_level": emission_level,
        "eco_status": eco_status,
        "recommendations": recommendations,
        "vehicle_type": vehicle_type,
        "emissions_grams": emissions_grams,
        "duration_min": duration_min
    }

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "RouteZero API is running", "version": "1.0.0"}

@app.post("/route-options")
async def route_options(request: Request):
    """
    Get eco-friendly route options between source and destination.
    
    Features:
    - Green carrier matching based on distance
    - Eco points calculation
    - Emissions comparison
    """
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
            
            # Calculate emissions for default vehicle (car/diesel)
            emissions_data = calculate_emissions(dist_km)
            
            # Get green carrier recommendation
            carrier_match = match_green_carrier(dist_km)
            
            # Calculate emissions for recommended vehicle
            recommended_emissions = calculate_emissions(dist_km, carrier_match["vehicle_type"])

            route_data.append({
                "distance_km": round(dist_km, 2),
                "duration_min": round(dur_min, 2),
                "emissions_grams": emissions_data["emissions_grams"],
                "emission_level": emissions_data["emission_level"],
                "eco_tag": get_eco_tag(emissions_data["emission_level"]),
                "eco_points": get_eco_points(emissions_data["emissions_grams"]),
                "green_carrier": {
                    "recommended_vehicle": carrier_match["vehicle_type"],
                    "reasoning": carrier_match["reasoning"],
                    "feasibility_score": carrier_match["feasibility_score"],
                    "eco_impact": carrier_match["eco_impact"],
                    "recommended_emissions_grams": recommended_emissions["emissions_grams"],
                    "emissions_saved_grams": round(emissions_data["emissions_grams"] - recommended_emissions["emissions_grams"], 2),
                    "recommended_eco_points": get_eco_points(recommended_emissions["emissions_grams"]),
                    "points_gained": get_eco_points(recommended_emissions["emissions_grams"]) - get_eco_points(emissions_data["emissions_grams"])
                }
            })

        # Sort routes by emissions (lowest to highest)
        route_data.sort(key=lambda x: x["emissions_grams"])
        
        return {"routes": route_data}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/route-explanation")
async def route_explanation(request: RouteExplanationRequest):
    """
    Generate a natural language explanation of route eco-friendliness.
    
    Features:
    - Modular design for LLM integration
    - Contextual explanations based on vehicle type and duration
    - Personalized recommendations
    """
    try:
        # Validate vehicle type
        valid_vehicles = ["ev", "hybrid", "car", "diesel"]
        if request.vehicle_type not in valid_vehicles:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid vehicle_type. Must be one of: {valid_vehicles}"
            )
        
        # Validate emissions
        if request.emissions_grams < 0:
            raise HTTPException(
                status_code=400,
                detail="emissions_grams cannot be negative"
            )
        
        # Validate duration
        if request.duration_min < 0:
            raise HTTPException(
                status_code=400,
                detail="duration_min cannot be negative"
            )
        
        # Generate explanation
        explanation_data = generate_eco_explanation(
            request.emissions_grams,
            request.vehicle_type,
            request.duration_min
        )
        
        return {
            "success": True,
            "data": explanation_data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/reverse-logistics")
async def reverse_logistics_optimization(request: ReverseLogisticsRequest):
    """
    Optimize reverse logistics by pairing returns with deliveries.
    
    Features:
    - Proximity-based pairing (within 3km)
    - Haversine distance calculation
    - Efficiency metrics
    """
    try:
        # Validate input data
        if not request.deliveries or not request.returns:
            raise HTTPException(
                status_code=400,
                detail="Both deliveries and returns lists must not be empty"
            )
        
        # Validate coordinate format
        for delivery in request.deliveries:
            if "id" not in delivery or "lat" not in delivery or "lon" not in delivery:
                raise HTTPException(
                    status_code=400,
                    detail="Each delivery must have 'id', 'lat', and 'lon' fields"
                )
        
        for return_item in request.returns:
            if "id" not in return_item or "lat" not in return_item or "lon" not in return_item:
                raise HTTPException(
                    status_code=400,
                    detail="Each return must have 'id', 'lat', and 'lon' fields"
                )
        
        # Optimize reverse pickup
        result = optimize_reverse_pickup(request.deliveries, request.returns)
        
        return {
            "success": True,
            "data": result
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy",
        "services": {
            "route_optimization": "available",
            "green_carrier_matching": "available",
            "eco_points_calculation": "available",
            "reverse_logistics": "available"
        }
    }
