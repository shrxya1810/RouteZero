def calculate_emissions(distance_km, vehicle_type="car"):
    """
    Calculate CO2 emissions for a given distance and vehicle type.
    
    Args:
        distance_km: Distance in kilometers
        vehicle_type: Type of vehicle ("car", "hybrid", "ev")
        
    Returns:
        dict: Contains emissions_grams and emission_level
    """
    # Emission factors in g/km
    factor = {
        "car": 192,
        "hybrid": 90,
        "ev": 0
    }
    
    emissions_grams = round(distance_km * factor.get(vehicle_type, 192), 2)
    
    # Determine emission level based on total emissions
    if emissions_grams <= 50:
        emission_level = "low"
    elif emissions_grams <= 150:
        emission_level = "medium"
    else:
        emission_level = "high"
    
    return {
        "emissions_grams": emissions_grams,
        "emission_level": emission_level
    }
