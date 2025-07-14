def calculate_emissions(distance_km, vehicle_type="car", mode="last_mile"):
    """
    Calculate CO2 emissions for a given distance and vehicle type.
    Supports both last-mile and freight modes.
    Args:
        distance_km: Distance in kilometers
        vehicle_type: Type of vehicle ("car", "hybrid", "ev", "heavy_truck", "rail_freight", "ship_barge")
        mode: "last_mile" or "freight"
    Returns:
        dict: Contains emissions_grams and emission_level
    """
    if mode == "freight":
        # Freight emission factors (g/km)
        factor = {
            "heavy_truck": 550,
            "rail_freight": 20,
            "ship_barge": 10
        }
        thresholds = {"low": 1000, "medium": 10000}
    else:
        # Last-mile emission factors (g/km)
        factor = {
            "car": 192,
            "hybrid": 90,
            "ev": 0
        }
        thresholds = {"low": 50, "medium": 150}
    emissions_grams = round(distance_km * factor.get(vehicle_type, list(factor.values())[0]), 2)
    # Determine emission level
    if emissions_grams <= thresholds["low"]:
        emission_level = "low"
    elif emissions_grams <= thresholds["medium"]:
        emission_level = "medium"
    else:
        emission_level = "high"
    return {
        "emissions_grams": emissions_grams,
        "emission_level": emission_level
    }
