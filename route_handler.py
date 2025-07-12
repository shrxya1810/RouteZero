import openrouteservice
from openrouteservice import convert
import os
from dotenv import load_dotenv
from typing import List, Tuple, Dict, Any, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()
ORS_API_KEY = os.getenv("ORS_API_KEY")

# Initialize client with error handling
try:
    if not ORS_API_KEY:
        raise ValueError("ORS_API_KEY environment variable is not set")
    client = openrouteservice.Client(key=ORS_API_KEY)
except Exception as e:
    logger.error(f"Failed to initialize OpenRouteService client: {e}")
    client = None

def validate_coordinates(coords: List[float], coord_name: str) -> bool:
    """
    Validate that coordinates are in [lng, lat] format with valid ranges.
    
    Args:
        coords: List of [lng, lat] coordinates
        coord_name: Name of the coordinate for error messages
        
    Returns:
        bool: True if coordinates are valid
    """
    if not isinstance(coords, list) or len(coords) != 2:
        logger.error(f"{coord_name} must be a list of [lng, lat] coordinates")
        return False
    
    lng, lat = coords
    
    if not isinstance(lng, (int, float)) or not isinstance(lat, (int, float)):
        logger.error(f"{coord_name} coordinates must be numeric values")
        return False
    
    if not (-180 <= lng <= 180):
        logger.error(f"{coord_name} longitude must be between -180 and 180 degrees")
        return False
    
    if not (-90 <= lat <= 90):
        logger.error(f"{coord_name} latitude must be between -90 and 90 degrees")
        return False
    
    return True

def get_routes(source: List[float], destination: List[float]) -> Dict[str, Any]:
    """
    Get route options between source and destination coordinates.
    
    Args:
        source: [lng, lat] coordinates of the source
        destination: [lng, lat] coordinates of the destination
        
    Returns:
        Dict containing route information or error details
        
    Raises:
        ValueError: If coordinates are invalid
        RuntimeError: If OpenRouteService client is not available
    """
    # Validate client availability
    if client is None:
        raise RuntimeError("OpenRouteService client is not available. Check your API key.")
    
    # Validate input coordinates
    if not validate_coordinates(source, "source"):
        raise ValueError("Invalid source coordinates")
    
    if not validate_coordinates(destination, "destination"):
        raise ValueError("Invalid destination coordinates")
    
    try:
        coords = [source, destination]
        
        logger.info(f"Requesting routes from {source} to {destination}")
        
        response = client.directions(
            coordinates=coords,
            profile='driving-car',
            format='geojson',
            alternative_routes={"share_factor": 0.6, "target_count": 3},
            instructions=False
        )
        
        # Extract only necessary information from response
        optimized_routes = {
            "type": "FeatureCollection",
            "features": []
        }
        
        for feature in response.get("features", []):
            # Extract only essential properties
            optimized_feature = {
                "type": "Feature",
                "geometry": feature.get("geometry"),
                "properties": {
                    "summary": feature.get("properties", {}).get("summary", {})
                }
            }
            optimized_routes["features"].append(optimized_feature)
        
        logger.info(f"Successfully retrieved {len(optimized_routes['features'])} route options")
        return optimized_routes
        
    except openrouteservice.exceptions.ApiError as e:
        logger.error(f"OpenRouteService API error: {e}")
        raise RuntimeError(f"Route service error: {e}")
        
    except openrouteservice.exceptions.HTTPError as e:
        logger.error(f"HTTP error when calling OpenRouteService: {e}")
        raise RuntimeError(f"Network error: {e}")
        
    except Exception as e:
        logger.error(f"Unexpected error in get_routes: {e}")
        raise RuntimeError(f"Unexpected error: {e}")

def get_routes_safe(source: List[float], destination: List[float]) -> Dict[str, Any]:
    """
    Safe wrapper for get_routes that returns error information instead of raising exceptions.
    
    Args:
        source: [lng, lat] coordinates of the source
        destination: [lng, lat] coordinates of the destination
        
    Returns:
        Dict with either route data or error information
    """
    try:
        routes = get_routes(source, destination)
        return {
            "success": True,
            "data": routes
        }
    except (ValueError, RuntimeError) as e:
        return {
            "success": False,
            "error": str(e)
        }
    except Exception as e:
        logger.error(f"Unexpected error in get_routes_safe: {e}")
        return {
            "success": False,
            "error": "An unexpected error occurred"
        }
