# RouteZero: Smart Logistics for Sustainable Retail Distribution

> **Walmart Sparkathon Project** - An AI-powered intelligent logistics optimizer that dynamically recommends the most sustainable product delivery routes and warehouse decisions, reducing carbon emissions, fuel consumption, and delivery times—while integrating community support and customer incentives.

## 🎯 Core Concept

RouteZero revolutionizes retail logistics by combining advanced route optimization with sustainability metrics, creating a comprehensive ecosystem that benefits businesses, customers, and the environment. Our platform intelligently balances delivery efficiency with environmental impact, making sustainable choices the default option.

## 🚀 Key Features Integration

### 1. **Carbon-Aware Logistics Engine**

#### Route Optimization
- **AI-Powered Path Selection**: Advanced algorithms choose delivery paths with the least carbon footprint using real-time traffic, fuel efficiency, and emission models
- **Multi-Criteria Optimization**: Considers distance, traffic conditions, vehicle type, and emission factors simultaneously
- **Alternative Route Generation**: Provides multiple route options with different sustainability profiles
- **Real-Time Adaptation**: Adjusts routes based on current traffic and environmental conditions

#### Green Carrier Matching
- **Distance-Based Vehicle Selection**: Automatically matches routes with optimal vehicle types (EV, hybrid, diesel) based on distance
- **Eco-Fleet Prioritization**: Prioritizes electric or hybrid vehicle fleets for short to medium distances
- **Feasibility Scoring**: Provides confidence scores for vehicle recommendations
- **Eco-Impact Assessment**: Categorizes environmental impact as minimal, low, medium, or high

#### Reverse Logistics Optimization
- **Proximity-Based Pairing**: Pairs returns with deliveries within 3km using Haversine distance calculation
- **Efficiency Metrics**: Tracks pairing efficiency and provides detailed analytics
- **Circular Economy Integration**: Supports sustainable product lifecycle management
- **Redundant Trip Elimination**: Minimizes empty return trips through intelligent route planning

### 2. **Customer Carbon Wallet**

#### Eco Points System
- **Tiered Reward Structure**: 
  - 50 points for ≤50g emissions (excellent)
  - 30 points for ≤150g emissions (good)
  - 0 points for >150g emissions (needs improvement)
- **Sustainable Choice Rewards**: Customers earn eco points for opting for green delivery options
- **Combined Delivery Incentives**: Rewards for consolidating multiple deliveries into single trips
- **Points Comparison**: Shows potential points gained by switching to greener vehicles

#### Green Delivery Challenges
- **Behavioral Nudges**: App encourages users to make more sustainable delivery choices
- **Gamification Elements**: Challenges and achievements for reducing carbon footprint
- **Educational Content**: Information about environmental impact of delivery choices

#### Real-Time Footprint Tracker
- **Live Emission Dashboard**: Real-time tracking of emissions saved by delivery choices
- **Historical Impact Analysis**: Long-term view of customer's environmental contribution
- **Personalized Insights**: Recommendations for further reducing carbon footprint

### 3. **Community Eco-Hub Integration**

#### Local Pickup Hubs
- **Strategic Hub Placement**: Network of pickup points at community centers, schools, and shared spaces
- **Convenience Optimization**: Hubs located for maximum accessibility and minimal travel
- **Community Engagement**: Local businesses and organizations as sustainability partners

#### Smart Bulk Routing
- **Community Delivery Optimization**: Encourages bulk community deliveries to reduce trip frequency
- **Neighborhood Coordination**: Coordinates deliveries within communities for efficiency
- **Shared Resource Utilization**: Maximizes use of community delivery infrastructure

#### Hub Leaderboard
- **Gamified Sustainability**: Leaderboards for hubs achieving highest reduction in delivery emissions
- **Community Competition**: Friendly competition between different pickup locations
- **Recognition System**: Rewards for most sustainable community delivery practices

## 🛠️ Technical Architecture

### Modular Code Structure

```
RouteZero/
├── main.py                 # FastAPI application with CORS support
├── emissions.py            # Core emissions calculation
├── carrier_selector.py     # Green carrier matching logic
├── eco_points.py          # Eco points calculation and tagging
├── reverse_logistics.py   # Reverse logistics optimization
├── route_handler.py       # Route optimization engine
└── pickup_hubs.json      # Hub location data
```

### Core Components

#### Route Optimization Engine
```python
# Advanced route calculation with emission consideration
def get_routes_safe(source: List[float], destination: List[float]) -> Dict[str, Any]:
    """
    Carbon-aware route optimization with multiple criteria:
    - Distance optimization
    - Emission calculation
    - Traffic consideration
    - Vehicle type matching
    """
```

#### Green Carrier Matching
```python
# Distance-based vehicle selection
def match_green_carrier(distance_km):
    """
    Matches optimal vehicle type based on distance:
    - EV: ≤300km (optimal for short distances)
    - Hybrid: ≤800km (medium distances)
    - Diesel: >800km (long distances)
    Returns feasibility score and reasoning
    """
```

#### Emission Calculation System
```python
# Multi-vehicle emission modeling
def calculate_emissions(distance_km, vehicle_type="car"):
    """
    Calculates CO2 emissions with eco-friendly categorization:
    - EV: 0 g/km
    - Hybrid: 90 g/km
    - Diesel/Car: 192 g/km
    """
```

#### Eco Points System
```python
# Tiered reward calculation
def get_eco_points(emissions_grams):
    """
    Calculates eco points based on emissions:
    - ≤50g: 50 points (excellent)
    - ≤150g: 30 points (good)
    - >150g: 0 points (needs improvement)
    """
```

#### Reverse Logistics Optimizer
```python
# Proximity-based pairing
def optimize_reverse_pickup(deliveries, returns):
    """
    Pairs returns with deliveries within 3km:
    - Haversine distance calculation
    - Efficiency metrics
    - Detailed pairing analytics
    """
```

### API Endpoints

#### Route Optimization with Green Carrier Matching
```http
POST /route-options
Content-Type: application/json

{
  "source": [77.6413, 12.9716],      // [longitude, latitude]
  "destination": [72.8777, 19.0760]   // [longitude, latitude]
}
```

**Response:**
```json
{
  "routes": [
    {
      "distance_km": 750.45,
      "duration_min": 420.30,
      "emissions_grams": 187.61,
      "emission_level": "high",
      "eco_tag": "non_eco",
      "eco_points": 0,
      "green_carrier": {
        "recommended_vehicle": "hybrid",
        "reasoning": "Hybrid for long distance (750.45km)",
        "feasibility_score": 0.75,
        "eco_impact": "medium",
        "recommended_emissions_grams": 67540.5,
        "emissions_saved_grams": -67352.89,
        "recommended_eco_points": 0,
        "points_gained": 0
      }
    }
  ]
}
```

#### Route Explanation API
```http
POST /route-explanation
Content-Type: application/json

{
  "emissions_grams": 25.5,
  "vehicle_type": "ev",
  "duration_min": 12.3
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "explanation": "This is a quick trip with very low emissions (25.5g CO2). Electric vehicles produce zero direct emissions, making this route highly eco-friendly. This route is excellent for the environment.",
    "eco_score": 50,
    "emission_level": "very low",
    "eco_status": "excellent",
    "recommendations": [
      "Excellent eco-friendly choice!",
      "This route sets a great example for sustainable transportation"
    ]
  }
}
```

#### Reverse Logistics Optimization
```http
POST /reverse-logistics
Content-Type: application/json

{
  "deliveries": [
    {"id": "d1", "lat": 12.9716, "lon": 77.6413}
  ],
  "returns": [
    {"id": "r1", "lat": 12.9750, "lon": 77.6450}
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paired_routes": [
      {
        "delivery_id": "d1",
        "return_id": "r1",
        "delivery_coords": [12.9716, 77.6413],
        "return_coords": [12.9750, 77.6450],
        "distance_km": 2.8,
        "route_type": "paired_delivery_return"
      }
    ],
    "total_pairs": 1,
    "pairing_efficiency": 100.0
  }
}
```

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "services": {
    "route_optimization": "available",
    "green_carrier_matching": "available",
    "eco_points_calculation": "available",
    "reverse_logistics": "available"
  }
}
```

## 🏗️ Installation & Setup

### Prerequisites
- Python 3.7+
- OpenRouteService API key (free tier available)

### Quick Start

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd RouteZero
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment**
   ```bash
   # Create .env file
   echo "ORS_API_KEY=your_openrouteservice_api_key" > .env
   ```

4. **Run the Application**
   ```bash
   uvicorn main:app --reload
   ```

5. **Access the API**
   - API Documentation: `http://localhost:8000/docs`
   - Health Check: `http://localhost:8000/health`
   - Root Endpoint: `http://localhost:8000/`

## 🧪 Testing & Validation

### Comprehensive Test Suite
```bash
# Test route optimization engine
python test_route_handler.py

# Test emission calculation system
python test_emissions.py

# Test eco-tagging and sorting
python test_eco_tags.py
```

### Sample Data
The project includes `pickup_hubs.json` with 8 realistic Walmart delivery hubs across India:
- **Tier 1 Cities**: Bangalore, Mumbai, Delhi, Hyderabad, Chennai, Pune
- **Tier 2 Cities**: Nagpur, Indore
- **Hub Types**: Warehouses, Fulfillment Centers, Retail Stores, Customer Locations

## 🔧 Technical Features

### Error Handling & Validation
- **Coordinate Validation**: Ensures [longitude, latitude] format with proper ranges
- **API Error Management**: Graceful handling of network and service errors
- **Input Validation**: Comprehensive validation of all user inputs
- **Logging & Monitoring**: Detailed logging for debugging and performance monitoring

### Performance Optimization
- **Response Optimization**: Returns only essential route data to reduce payload size
- **Caching Strategy**: Intelligent caching of frequently requested routes
- **Async Processing**: Non-blocking API responses for better user experience

### CORS Support
- **Frontend Integration**: Full CORS support for seamless frontend-backend integration
- **Configurable Origins**: Easy configuration for production environments
- **Cross-Origin Requests**: Handles all HTTP methods and headers

### Sustainability Metrics
- **Real-Time Emission Tracking**: Live calculation of CO2 emissions per route
- **Vehicle Type Optimization**: Different emission factors for car, hybrid, and EV
- **Eco-Friendly Sorting**: Automatic prioritization of sustainable routes
- **Points-Based Rewards**: Gamified sustainability with eco points system

## 🌱 Environmental Impact

### Carbon Reduction Features
- **Emission-Aware Routing**: Routes optimized for minimal carbon footprint
- **Green Vehicle Prioritization**: Automatic selection of eco-friendly transport options
- **Community Consolidation**: Bulk deliveries to reduce overall vehicle trips
- **Reverse Logistics**: Efficient return routes to minimize empty trips
- **Proximity-Based Pairing**: Intelligent pairing of deliveries and returns

### Customer Engagement
- **Eco Points System**: Tiered rewards for sustainable delivery choices
- **Educational Dashboard**: Real-time impact visualization with natural language explanations
- **Behavioral Nudges**: Encourages environmentally conscious decisions
- **Gamification**: Points-based system with clear improvement metrics

## 🏆 Walmart Sparkathon Alignment

### Innovation Criteria Met
✅ **AI-Powered Optimization**: Advanced algorithms for route and emission optimization  
✅ **Sustainability Focus**: Comprehensive carbon footprint reduction with green carrier matching  
✅ **Customer Engagement**: Gamified eco-friendly choices with points system  
✅ **Community Integration**: Local pickup hubs and bulk delivery coordination  
✅ **Real-World Impact**: Practical implementation for retail logistics  
✅ **Scalable Architecture**: Modular design for enterprise deployment  
✅ **LLM Integration Ready**: Route explanation API for AI-enhanced insights  

### Business Value
- **Cost Reduction**: Optimized routes reduce fuel consumption and delivery costs
- **Customer Satisfaction**: Faster, more sustainable delivery options with clear explanations
- **Brand Enhancement**: Demonstrates commitment to environmental responsibility
- **Operational Efficiency**: Streamlined logistics with better resource utilization
- **Data-Driven Insights**: Comprehensive analytics for continuous improvement

## 🤝 Contributing

This project is developed for the Walmart Sparkathon. For questions or collaboration opportunities, please reach out to the development team.

## 📄 License

This project is developed as part of the Walmart Sparkathon competition. All rights reserved.

---

**RouteZero** - Making sustainable logistics the smart choice for tomorrow's retail ecosystem.
