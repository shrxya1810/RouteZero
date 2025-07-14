#!/usr/bin/env python3
"""
Test script for the improved calculate_emissions function
"""

import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from emissions import calculate_emissions
    print("✓ Successfully imported emissions module")
except ImportError as e:
    print(f"✗ Failed to import emissions module: {e}")
    sys.exit(1)

def test_emission_levels():
    """Test emission level categorization"""
    print("\n--- Testing Emission Levels ---")
    
    # Test low emissions (≤ 50g)
    print("Testing low emissions:")
    result = calculate_emissions(0.2, "car")  # 0.2 km * 192 g/km = 38.4g
    print(f"  Distance: 0.2km, Vehicle: car")
    print(f"  Emissions: {result['emissions_grams']}g, Level: {result['emission_level']}")
    assert result['emission_level'] == "low", "Should be low emissions"
    print("✓ Low emissions correctly categorized")
    
    # Test medium emissions (51-150g)
    print("\nTesting medium emissions:")
    result = calculate_emissions(0.5, "car")  # 0.5 km * 192 g/km = 96g
    print(f"  Distance: 0.5km, Vehicle: car")
    print(f"  Emissions: {result['emissions_grams']}g, Level: {result['emission_level']}")
    assert result['emission_level'] == "medium", "Should be medium emissions"
    print("✓ Medium emissions correctly categorized")
    
    # Test high emissions (>150g)
    print("\nTesting high emissions:")
    result = calculate_emissions(1.0, "car")  # 1.0 km * 192 g/km = 192g
    print(f"  Distance: 1.0km, Vehicle: car")
    print(f"  Emissions: {result['emissions_grams']}g, Level: {result['emission_level']}")
    assert result['emission_level'] == "high", "Should be high emissions"
    print("✓ High emissions correctly categorized")

def test_vehicle_types():
    """Test different vehicle types"""
    print("\n--- Testing Vehicle Types ---")
    
    distance = 1.0  # 1 km
    
    # Test car
    result = calculate_emissions(distance, "car")
    print(f"Car: {result['emissions_grams']}g ({result['emission_level']})")
    assert result['emissions_grams'] == 192.0, "Car emissions should be 192g"
    
    # Test hybrid
    result = calculate_emissions(distance, "hybrid")
    print(f"Hybrid: {result['emissions_grams']}g ({result['emission_level']})")
    assert result['emissions_grams'] == 90.0, "Hybrid emissions should be 90g"
    
    # Test electric vehicle
    result = calculate_emissions(distance, "ev")
    print(f"EV: {result['emissions_grams']}g ({result['emission_level']})")
    assert result['emissions_grams'] == 0.0, "EV emissions should be 0g"
    assert result['emission_level'] == "low", "EV should always be low emissions"
    
    print("✓ All vehicle types working correctly")

def test_edge_cases():
    """Test edge cases for emission levels"""
    print("\n--- Testing Edge Cases ---")
    
    # Test exactly at the low/medium boundary (50g)
    result = calculate_emissions(50/192, "car")  # 50g / 192 g/km = 0.26km
    print(f"At low/medium boundary: {result['emissions_grams']}g ({result['emission_level']})")
    assert result['emission_level'] == "low", "50g should be low"
    
    # Test exactly at the medium/high boundary (150g)
    result = calculate_emissions(150/192, "car")  # 150g / 192 g/km = 0.78km
    print(f"At medium/high boundary: {result['emissions_grams']}g ({result['emission_level']})")
    assert result['emission_level'] == "medium", "150g should be medium"
    
    # Test just above medium/high boundary (151g)
    result = calculate_emissions(151/192, "car")  # 151g / 192 g/km = 0.79km
    print(f"Just above medium/high boundary: {result['emissions_grams']}g ({result['emission_level']})")
    assert result['emission_level'] == "high", "151g should be high"
    
    print("✓ Edge cases handled correctly")

def test_return_format():
    """Test that the function returns the expected format"""
    print("\n--- Testing Return Format ---")
    
    result = calculate_emissions(1.0, "car")
    
    # Check that result is a dictionary
    assert isinstance(result, dict), "Result should be a dictionary"
    
    # Check that it has the expected keys
    assert "emissions_grams" in result, "Should have emissions_grams key"
    assert "emission_level" in result, "Should have emission_level key"
    
    # Check data types
    assert isinstance(result["emissions_grams"], (int, float)), "emissions_grams should be numeric"
    assert isinstance(result["emission_level"], str), "emission_level should be string"
    
    # Check emission level is one of the expected values
    assert result["emission_level"] in ["low", "medium", "high"], "emission_level should be low, medium, or high"
    
    print("✓ Return format is correct")
    print(f"  Sample result: {result}")

if __name__ == "__main__":
    print("RouteZero Emissions Test")
    print("=" * 40)
    
    try:
        test_emission_levels()
        test_vehicle_types()
        test_edge_cases()
        test_return_format()
        
        print("\n" + "=" * 40)
        print("✓ All emissions tests completed successfully!")
        
    except Exception as e:
        print(f"\n✗ Test failed with error: {e}")
        sys.exit(1) 