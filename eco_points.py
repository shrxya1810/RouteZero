def get_eco_points(emissions_grams):
    """
    Calculate eco points based on emissions in grams.
    
    Args:
        emissions_grams: CO2 emissions in grams
        
    Returns:
        int: Eco points (50, 30, or 0)
    """
    if emissions_grams <= 50:
        return 50
    elif emissions_grams <= 150:
        return 30
    else:
        return 0

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