import math

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the distance between two points on Earth using the Haversine formula.
    
    Args:
        lat1, lon1: Latitude and longitude of first point
        lat2, lon2: Latitude and longitude of second point
        
    Returns:
        float: Distance in kilometers
    """
    # Convert latitude and longitude from degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    # Earth's radius in kilometers
    r = 6371
    
    return c * r

def optimize_reverse_pickup(deliveries, returns):
    """
    Pair returns with deliveries if they are within 3 km of each other.
    
    Args:
        deliveries: List of delivery locations with coordinates
                   Format: [{"id": "d1", "lat": 12.9716, "lon": 77.6413}, ...]
        returns: List of return locations with coordinates
                Format: [{"id": "r1", "lat": 12.9750, "lon": 77.6450}, ...]
        
    Returns:
        dict: Contains paired_routes and unpaired_items
    """
    paired_routes = []
    unpaired_deliveries = []
    unpaired_returns = []
    
    # Track which deliveries and returns have been paired
    used_deliveries = set()
    used_returns = set()
    
    # Check each delivery against each return
    for delivery in deliveries:
        if delivery["id"] in used_deliveries:
            continue
            
        best_return = None
        best_distance = float('inf')
        
        for return_item in returns:
            if return_item["id"] in used_returns:
                continue
                
            # Calculate distance using haversine formula
            distance = haversine_distance(
                delivery["lat"], delivery["lon"],
                return_item["lat"], return_item["lon"]
            )
            
            # If within 3 km and better than previous best
            if distance <= 3.0 and distance < best_distance:
                best_return = return_item
                best_distance = distance
        
        # If we found a suitable return, create a paired route
        if best_return:
            paired_routes.append({
                "delivery_id": delivery["id"],
                "return_id": best_return["id"],
                "delivery_coords": [delivery["lat"], delivery["lon"]],
                "return_coords": [best_return["lat"], best_return["lon"]],
                "distance_km": round(best_distance, 2),
                "route_type": "paired_delivery_return"
            })
            
            # Mark as used
            used_deliveries.add(delivery["id"])
            used_returns.add(best_return["id"])
        else:
            # No suitable return found for this delivery
            unpaired_deliveries.append(delivery)
    
    # Add remaining unpaired returns
    for return_item in returns:
        if return_item["id"] not in used_returns:
            unpaired_returns.append(return_item)
    
    return {
        "paired_routes": paired_routes,
        "unpaired_deliveries": unpaired_deliveries,
        "unpaired_returns": unpaired_returns,
        "total_pairs": len(paired_routes),
        "total_deliveries": len(deliveries),
        "total_returns": len(returns),
        "pairing_efficiency": round(len(paired_routes) / min(len(deliveries), len(returns)) * 100, 1) if min(len(deliveries), len(returns)) > 0 else 0
    } 