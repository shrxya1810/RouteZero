#!/usr/bin/env python3
"""
Test script for the refactored route_handler.py
"""

import sys
import os
from typing import List

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from route_handler import get_routes_safe, validate_coordinates
    print("✓ Successfully imported route_handler")
except ImportError as e:
    print(f"✗ Failed to import route_handler: {e}")
    print("Please install dependencies: pip install -r requirements.txt")
    sys.exit(1)

def test_coordinate_validation():
    """Test coordinate validation function"""
    print("\n--- Testing Coordinate Validation ---")
    
    # Valid coordinates
    valid_coords = [2.3522, 48.8566]  # Paris
    assert validate_coordinates(valid_coords, "test"), "Valid coordinates should pass"
    print("✓ Valid coordinates [2.3522, 48.8566] passed validation")
    
    # Invalid coordinates - wrong type
    invalid_type = "not a list"
    try:
        validate_coordinates(invalid_type, "test")  # type: ignore
        assert False, "Invalid type should fail"
    except (TypeError, AttributeError):
        print("✓ Invalid type correctly rejected")
    
    # Invalid coordinates - wrong length
    invalid_length = [1.0]
    assert not validate_coordinates(invalid_length, "test"), "Wrong length should fail"
    print("✓ Wrong length correctly rejected")
    
    # Invalid coordinates - out of range longitude
    invalid_lng = [181.0, 48.8566]
    assert not validate_coordinates(invalid_lng, "test"), "Invalid longitude should fail"
    print("✓ Invalid longitude correctly rejected")
    
    # Invalid coordinates - out of range latitude
    invalid_lat = [2.3522, 91.0]
    assert not validate_coordinates(invalid_lat, "test"), "Invalid latitude should fail"
    print("✓ Invalid latitude correctly rejected")

def test_route_handling():
    """Test route handling with various scenarios"""
    print("\n--- Testing Route Handling ---")
    
    # Test with valid coordinates
    source = [2.3522, 48.8566]  # Paris
    destination = [3.3792, 43.2965]  # Montpellier
    
    print(f"Testing route from {source} to {destination}")
    result = get_routes_safe(source, destination)
    
    if result["success"]:
        print("✓ Successfully retrieved routes")
        routes = result["data"]
        print(f"  Found {len(routes['features'])} route options")
        
        # Check that response is optimized (only essential fields)
        for i, feature in enumerate(routes["features"]):
            print(f"  Route {i+1}:")
            summary = feature["properties"]["summary"]
            print(f"    Distance: {summary['distance']/1000:.2f} km")
            print(f"    Duration: {summary['duration']/60:.2f} minutes")
    else:
        print(f"✗ Failed to get routes: {result['error']}")
    
    # Test with invalid coordinates
    print(f"\nTesting with invalid coordinates")
    invalid_source = [200.0, 48.8566]  # Invalid longitude
    result = get_routes_safe(invalid_source, destination)
    
    if not result["success"]:
        print("✓ Correctly rejected invalid coordinates")
        print(f"  Error: {result['error']}")
    else:
        print("✗ Should have rejected invalid coordinates")

def test_error_handling():
    """Test error handling scenarios"""
    print("\n--- Testing Error Handling ---")
    
    # Test with missing coordinates
    print("Testing with missing coordinates")
    result = get_routes_safe(None, [3.3792, 43.2965])  # type: ignore
    if not result["success"]:
        print("✓ Correctly handled missing coordinates")
    else:
        print("✗ Should have handled missing coordinates")
    
    # Test with empty coordinates
    print("Testing with empty coordinates")
    result = get_routes_safe([], [3.3792, 43.2965])
    if not result["success"]:
        print("✓ Correctly handled empty coordinates")
    else:
        print("✗ Should have handled empty coordinates")

if __name__ == "__main__":
    print("RouteZero Route Handler Test")
    print("=" * 40)
    
    try:
        test_coordinate_validation()
        test_route_handling()
        test_error_handling()
        
        print("\n" + "=" * 40)
        print("✓ All tests completed successfully!")
        
    except Exception as e:
        print(f"\n✗ Test failed with error: {e}")
        sys.exit(1) 