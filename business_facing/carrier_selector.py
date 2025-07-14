def match_green_carrier(distance_km):
    """
    Match the most eco-friendly vehicle type based on delivery distance.
    
    Args:
        distance_km: Distance in kilometers
        
    Returns:
        dict: Contains vehicle_type, reasoning, and feasibility_score
    """
    # Vehicle specifications and constraints
    vehicles = {
        "ev": {
            "max_range_km": 300,  # Typical EV range
            "emission_factor": 0,  # g/km
            "eco_score": 10,  # Highest eco-friendliness
            "availability": 0.7,  # 70% of routes have EV availability
            "cost_factor": 1.2  # 20% more expensive than diesel
        },
        "hybrid": {
            "max_range_km": 800,  # Hybrid range
            "emission_factor": 90,  # g/km
            "eco_score": 7,
            "availability": 0.9,  # 90% availability
            "cost_factor": 1.1  # 10% more expensive
        },
        "diesel": {
            "max_range_km": 1200,  # Diesel range
            "emission_factor": 192,  # g/km
            "eco_score": 3,
            "availability": 1.0,  # 100% availability
            "cost_factor": 1.0  # Base cost
        }
    }
    
    # Distance-based logic
    if distance_km <= 50:
        # Short distance: Prefer EV, fallback to hybrid
        if distance_km <= vehicles["ev"]["max_range_km"]:
            return {
                "vehicle_type": "ev",
                "reasoning": f"EV optimal for short distance ({distance_km}km)",
                "feasibility_score": 0.95,
                "eco_impact": "minimal"
            }
        else:
            return {
                "vehicle_type": "hybrid",
                "reasoning": f"Hybrid best for medium distance ({distance_km}km)",
                "feasibility_score": 0.9,
                "eco_impact": "low"
            }
    
    elif distance_km <= 150:
        # Medium distance: Hybrid preferred, EV if available
        if distance_km <= vehicles["ev"]["max_range_km"]:
            return {
                "vehicle_type": "ev",
                "reasoning": f"EV suitable for medium distance ({distance_km}km)",
                "feasibility_score": 0.8,
                "eco_impact": "minimal"
            }
        else:
            return {
                "vehicle_type": "hybrid",
                "reasoning": f"Hybrid optimal for medium-long distance ({distance_km}km)",
                "feasibility_score": 0.85,
                "eco_impact": "low"
            }
    
    elif distance_km <= 300:
        # Long distance: Hybrid or diesel based on availability
        if distance_km <= vehicles["ev"]["max_range_km"]:
            return {
                "vehicle_type": "ev",
                "reasoning": f"EV at range limit for long distance ({distance_km}km)",
                "feasibility_score": 0.6,
                "eco_impact": "minimal"
            }
        else:
            return {
                "vehicle_type": "hybrid",
                "reasoning": f"Hybrid for long distance ({distance_km}km)",
                "feasibility_score": 0.75,
                "eco_impact": "medium"
            }
    
    else:
        # Very long distance: Diesel or hybrid
        if distance_km <= vehicles["hybrid"]["max_range_km"]:
            return {
                "vehicle_type": "hybrid",
                "reasoning": f"Hybrid for very long distance ({distance_km}km)",
                "feasibility_score": 0.7,
                "eco_impact": "medium"
            }
        else:
            return {
                "vehicle_type": "diesel",
                "reasoning": f"Diesel required for very long distance ({distance_km}km)",
                "feasibility_score": 0.9,
                "eco_impact": "high"
            } 