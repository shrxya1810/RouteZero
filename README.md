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
- **Eco-Fleet Prioritization**: Automatically prioritizes electric or hybrid vehicle fleets
- **Eco-Certified Partner Integration**: Matches deliveries with environmentally certified logistics partners
- **Vehicle Type Optimization**: Routes are optimized based on available vehicle types (car, hybrid, EV)

#### Reverse Logistics
- **Return Route Optimization**: Picks up recyclables and returned goods on delivery return routes
- **Redundant Trip Elimination**: Minimizes empty return trips through intelligent route planning
- **Circular Economy Integration**: Supports sustainable product lifecycle management

### 2. **Customer Carbon Wallet**

#### Eco Miles System
- **Sustainable Choice Rewards**: Customers earn eco points for opting for green delivery options
- **Combined Delivery Incentives**: Rewards for consolidating multiple deliveries into single trips
- **Pickup Hub Utilization**: Points for using local pickup hubs instead of home delivery

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

#### Emission Calculation System
```python
# Multi-vehicle emission modeling
def calculate_emissions(distance_km, vehicle_type="car"):
    """
    Calculates CO2 emissions with eco-friendly categorization:
    - Low emissions (≤50g): eco_friendly
    - Medium emissions (51-150g): mid
    - High emissions (>150g): non_eco
    """
```

#### Eco-Tagging and Sorting
```python
# Automatic route categorization and sorting
def get_eco_tag(emission_level: str) -> str:
    """
    Converts emission levels to user-friendly eco tags:
    - eco_friendly: Most sustainable options
    - mid: Balanced options
    - non_eco: Traditional routes
    """
```

### API Endpoints

#### Route Optimization
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
      "eco_tag": "non_eco"
    },
    {
      "distance_km": 780.20,
      "duration_min": 450.15,
      "emissions_grams": 96.30,
      "emission_level": "low",
      "eco_tag": "eco_friendly"
    }
  ]
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

### Sustainability Metrics
- **Real-Time Emission Tracking**: Live calculation of CO2 emissions per route
- **Vehicle Type Optimization**: Different emission factors for car, hybrid, and EV
- **Eco-Friendly Sorting**: Automatic prioritization of sustainable routes

## 🌱 Environmental Impact

### Carbon Reduction Features
- **Emission-Aware Routing**: Routes optimized for minimal carbon footprint
- **Green Vehicle Prioritization**: Automatic selection of eco-friendly transport options
- **Community Consolidation**: Bulk deliveries to reduce overall vehicle trips
- **Reverse Logistics**: Efficient return routes to minimize empty trips

### Customer Engagement
- **Eco Miles System**: Rewards for sustainable delivery choices
- **Educational Dashboard**: Real-time impact visualization
- **Behavioral Nudges**: Encourages environmentally conscious decisions

## 🏆 Walmart Sparkathon Alignment

### Innovation Criteria Met
✅ **AI-Powered Optimization**: Advanced algorithms for route and emission optimization  
✅ **Sustainability Focus**: Comprehensive carbon footprint reduction  
✅ **Customer Engagement**: Gamified eco-friendly choices  
✅ **Community Integration**: Local pickup hubs and bulk delivery coordination  
✅ **Real-World Impact**: Practical implementation for retail logistics  
✅ **Scalable Architecture**: Designed for enterprise deployment  

### Business Value
- **Cost Reduction**: Optimized routes reduce fuel consumption and delivery costs
- **Customer Satisfaction**: Faster, more sustainable delivery options
- **Brand Enhancement**: Demonstrates commitment to environmental responsibility
- **Operational Efficiency**: Streamlined logistics with better resource utilization

## 🤝 Contributing

This project is developed for the Walmart Sparkathon. For questions or collaboration opportunities, please reach out to the development team.

## 📄 License

This project is developed as part of the Walmart Sparkathon competition. All rights reserved.

---

**RouteZero** - Making sustainable logistics the smart choice for tomorrow's retail ecosystem.
