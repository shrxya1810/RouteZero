import logging
from typing import Dict, Any, List

logger = logging.getLogger("fleet_emissions")

FREIGHT_EMISSION_FACTORS = {
    "heavy_truck": 550,   # g/km
    "rail_freight": 20,   # g/km
    "ship_barge": 10      # g/km
}

FREIGHT_EMISSION_THRESHOLDS = {
    "low": 1000,    # g/km
    "medium": 10000 # g/km
    # >10000 is high
}

def calculate_freight_emissions(distance_km: float, vehicle_type: str = "heavy_truck") -> Dict[str, Any]:
    """
    Calculate emissions for freight logistics based on vehicle type.
    """
    factor = FREIGHT_EMISSION_FACTORS.get(vehicle_type, FREIGHT_EMISSION_FACTORS["heavy_truck"])
    emissions_grams = round(distance_km * factor, 2)
    # Determine emission level
    if emissions_grams <= FREIGHT_EMISSION_THRESHOLDS["low"]:
        emission_level = "low"
    elif emissions_grams <= FREIGHT_EMISSION_THRESHOLDS["medium"]:
        emission_level = "medium"
    else:
        emission_level = "high"
    logger.info(f"Freight emissions: {emissions_grams}g ({emission_level}) for {distance_km}km via {vehicle_type}")
    return {
        "emissions_grams": emissions_grams,
        "freight_emission_level": emission_level
    }

def recommend_freight_mode(distance_km: float, current_vehicle: str = "heavy_truck") -> Dict[str, Any]:
    """
    Recommend the most eco-friendly freight mode for a given distance.
    """
    # Calculate emissions for all modes
    emissions_by_mode = {
        mode: calculate_freight_emissions(distance_km, mode)["emissions_grams"]
        for mode in FREIGHT_EMISSION_FACTORS
    }
    # Find the best (lowest emission) mode
    best_mode = min(emissions_by_mode.keys(), key=lambda m: emissions_by_mode[m])
    best_emissions = emissions_by_mode[best_mode]
    current_emissions = emissions_by_mode.get(current_vehicle, best_emissions)
    emissions_saved = current_emissions - best_emissions
    percent_saved = (emissions_saved / current_emissions * 100) if current_emissions > 0 else 0
    logger.info(f"Best freight mode: {best_mode} (saves {percent_saved:.1f}% emissions)")
    return {
        "recommended_mode": best_mode,
        "emissions_saved_grams": emissions_saved,
        "percent_emissions_saved": round(percent_saved, 2),
        "best_emissions_grams": best_emissions
    }

def mock_freight_route(source: List[float], destination: List[float], mode: str = "heavy_truck") -> Dict[str, Any]:
    """
    Mock a freight route between two points. Returns distance (km) and duration (min).
    """
    # For demo, use haversine formula for distance, and a simple speed model
    from math import radians, sin, cos, sqrt, atan2
    lat1, lon1 = source[1], source[0]
    lat2, lon2 = destination[1], destination[0]
    R = 6371  # Earth radius in km
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    distance_km = R * c
    # Assume average speeds (km/h)
    avg_speeds = {"heavy_truck": 60, "rail_freight": 80, "ship_barge": 30}
    speed = avg_speeds.get(mode, 60)
    duration_min = (distance_km / speed) * 60
    logger.info(f"Mocked freight route: {distance_km:.2f}km, {duration_min:.1f}min via {mode}")
    return {
        "distance_km": round(distance_km, 2),
        "duration_min": round(duration_min, 1)
    }

def get_freight_routes(source: List[float], destination: List[float], mode: str = "heavy_truck") -> Dict[str, Any]:
    """
    Get a freight route and emissions estimate between two points.
    """
    # In production, use ORS or a real freight API. Here, use mock.
    route = mock_freight_route(source, destination, mode)
    emissions = calculate_freight_emissions(route["distance_km"], mode)
    recommendation = recommend_freight_mode(route["distance_km"], mode)
    return {
        **route,
        **emissions,
        "vehicle_type": mode,
        **recommendation
    } 