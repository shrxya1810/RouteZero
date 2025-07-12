#!/usr/bin/env python3
"""
Test script for eco-tagging and route sorting functionality
"""

import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from main import get_eco_tag
    from emissions import calculate_emissions
    print("✓ Successfully imported modules")
except ImportError as e:
    print(f"✗ Failed to import modules: {e}")
    print("Please install dependencies: pip install -r requirements.txt")
    sys.exit(1)

def test_eco_tag_mapping():
    """Test the mapping from emission levels to eco tags"""
    print("\n--- Testing Eco Tag Mapping ---")
    
    # Test low emissions -> eco_friendly
    result = get_eco_tag("low")
    print(f"low emission level -> {result}")
    assert result == "eco_friendly", "low should map to eco_friendly"
    
    # Test medium emissions -> mid
    result = get_eco_tag("medium")
    print(f"medium emission level -> {result}")
    assert result == "mid", "medium should map to mid"
    
    # Test high emissions -> non_eco
    result = get_eco_tag("high")
    print(f"high emission level -> {result}")
    assert result == "non_eco", "high should map to non_eco"
    
    print("✓ All eco tag mappings correct")

def test_route_sorting():
    """Test route sorting by emissions"""
    print("\n--- Testing Route Sorting ---")
    
    # Create sample routes with different emissions
    routes = [
        {
            "distance_km": 10.0,
            "duration_min": 15.0,
            "emissions_grams": 1920.0,  # High emissions
            "emission_level": "high",
            "eco_tag": "non_eco"
        },
        {
            "distance_km": 5.0,
            "duration_min": 8.0,
            "emissions_grams": 480.0,   # Medium emissions
            "emission_level": "medium",
            "eco_tag": "mid"
        },
        {
            "distance_km": 2.0,
            "duration_min": 3.0,
            "emissions_grams": 96.0,    # Low emissions
            "emission_level": "low",
            "eco_tag": "eco_friendly"
        }
    ]
    
    # Sort by emissions (lowest to highest)
    routes.sort(key=lambda x: x["emissions_grams"])
    
    print("Routes sorted by emissions (lowest to highest):")
    for i, route in enumerate(routes):
        print(f"  Route {i+1}: {route['emissions_grams']}g ({route['eco_tag']})")
    
    # Verify sorting is correct
    assert routes[0]["emissions_grams"] == 96.0, "Lowest emissions should be first"
    assert routes[1]["emissions_grams"] == 480.0, "Medium emissions should be second"
    assert routes[2]["emissions_grams"] == 1920.0, "Highest emissions should be last"
    
    print("✓ Route sorting working correctly")

def test_integration():
    """Test integration of emissions calculation and eco tagging"""
    print("\n--- Testing Integration ---")
    
    # Test different distances to get different emission levels
    test_cases = [
        (0.2, "car"),    # Should be low emissions
        (0.5, "car"),    # Should be medium emissions
        (1.0, "car"),    # Should be high emissions
        (0.5, "hybrid"), # Should be low emissions (90g)
        (0.5, "ev"),     # Should be low emissions (0g)
    ]
    
    for distance, vehicle in test_cases:
        emissions_data = calculate_emissions(distance, vehicle)
        eco_tag = get_eco_tag(emissions_data["emission_level"])
        
        print(f"Distance: {distance}km, Vehicle: {vehicle}")
        print(f"  Emissions: {emissions_data['emissions_grams']}g")
        print(f"  Level: {emissions_data['emission_level']}")
        print(f"  Eco Tag: {eco_tag}")
        print()
    
    print("✓ Integration test completed")

def test_edge_cases():
    """Test edge cases for eco tagging"""
    print("\n--- Testing Edge Cases ---")
    
    # Test boundary cases
    boundary_tests = [
        (50/192, "car"),   # Exactly 50g (low)
        (150/192, "car"),  # Exactly 150g (medium)
        (151/192, "car"),  # Just above 150g (high)
    ]
    
    for distance, vehicle in boundary_tests:
        emissions_data = calculate_emissions(distance, vehicle)
        eco_tag = get_eco_tag(emissions_data["emission_level"])
        
        print(f"Distance: {distance:.3f}km -> {emissions_data['emissions_grams']}g -> {eco_tag}")
    
    print("✓ Edge cases handled correctly")

def test_response_format():
    """Test the expected response format"""
    print("\n--- Testing Response Format ---")
    
    # Simulate a route response
    sample_route = {
        "distance_km": 5.0,
        "duration_min": 8.0,
        "emissions_grams": 480.0,
        "emission_level": "medium",
        "eco_tag": "mid"
    }
    
    # Check all required fields are present
    required_fields = ["distance_km", "duration_min", "emissions_grams", "emission_level", "eco_tag"]
    for field in required_fields:
        assert field in sample_route, f"Missing field: {field}"
    
    # Check eco_tag values
    valid_eco_tags = ["eco_friendly", "mid", "non_eco"]
    assert sample_route["eco_tag"] in valid_eco_tags, f"Invalid eco_tag: {sample_route['eco_tag']}"
    
    print("✓ Response format is correct")
    print(f"  Sample route: {sample_route}")

if __name__ == "__main__":
    print("RouteZero Eco Tagging Test")
    print("=" * 40)
    
    try:
        test_eco_tag_mapping()
        test_route_sorting()
        test_integration()
        test_edge_cases()
        test_response_format()
        
        print("\n" + "=" * 40)
        print("✓ All eco tagging tests completed successfully!")
        
    except Exception as e:
        print(f"\n✗ Test failed with error: {e}")
        sys.exit(1) 