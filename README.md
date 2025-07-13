---

# RouteZero Backend (Walmart Sparkathon)

**RouteZero** is a modular, production-grade FastAPI backend for sustainable logistics, built for the Walmart Sparkathon. It provides advanced route optimization, emissions tracking, green carrier assignment, eco points, reverse logistics, and LLM-powered explanations for eco-friendly delivery.

---

## 🚀 Project Overview

RouteZero powers eco-conscious delivery by:
- Optimizing delivery and return routes for minimal emissions
- Assigning the greenest feasible carrier (EV, hybrid, diesel) per route
- Calculating and rewarding eco points for sustainable choices
- Providing natural language explanations (via LLM) for every route
- Enabling reverse logistics (pairing returns with deliveries)
- Exposing a robust, CORS-enabled API for frontend and AI integration

---

## 🌟 Key Features

- **Route Optimization**: Multi-criteria, carbon-aware route selection using OpenRouteService
- **Emissions Calculation**: Per-route CO₂ emissions for all vehicle types
- **Green Carrier Matching**: Assigns best vehicle (EV/hybrid/diesel) based on distance and feasibility
- **Eco Points System**: Gamified, tiered rewards for low-emission routes
- **LLM Integration**: Dynamic, user-friendly explanations for any route via `/generate-explanation`
- **Reverse Logistics**: Pairs returns with deliveries within 3km for circular logistics
- **CORS Support**: Ready for frontend and cross-origin requests
- **Robust Validation & Error Handling**: For all endpoints and payloads

---

## 📚 API Endpoints Summary

| Endpoint                  | Method | Description                                                                                  |
|---------------------------|--------|----------------------------------------------------------------------------------------------|
| `/route-options`          | POST   | Get optimized routes, emissions, eco points, and green carrier assignment                    |
| `/route-explanation`      | POST   | Get a simple, modular natural language explanation for a route                               |
| `/generate-explanation`   | POST   | Get a dynamic LLM-generated explanation for a route (for frontend \"Why this route?\" popups)|
| `/reverse-logistics`      | POST   | Pair returns with deliveries based on proximity (reverse logistics optimizer)                |
| `/health`                 | GET    | Health check/status                                                                          |
| `/`                       | GET    | Root endpoint (basic health check)                                                           |

---

## 🗂️ Folder & File Structure

```
RouteZero/
├── main.py                # FastAPI app, all endpoints, CORS, LLM integration
├── emissions.py           # Emissions calculation logic
├── carrier_selector.py    # Green carrier matching logic
├── eco_points.py          # Eco points and eco tag logic
├── reverse_logistics.py   # Reverse logistics optimizer (proximity-based pairing)
├── route_handler.py       # Route optimization engine (OpenRouteService)
├── pickup_hubs.json       # Sample hub data
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables (not committed)
├── test_*.py              # Test suites
└── README.md              # This file
```

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd RouteZero
```

### 2. Create and Activate a Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the project root with:

```
ORS_API_KEY=your_openrouteservice_api_key
LLM_API_URL=http://localhost:8001/explain-route   # (or your LLM endpoint)
LLM_API_KEY=your_llm_api_key                      # (if required)
```

---

## ▶️ Run Instructions

Start the FastAPI server (with hot reload):

```bash
uvicorn main:app --reload
```

- API docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health check: [http://localhost:8000/health](http://localhost:8000/health)

---

## 📝 API Usage Examples

### 1. Route Optimization

**Request:**
```json
POST /route-options
{
  "source": [77.6413, 12.9716],
  "destination": [72.8777, 19.0760]
}
```
**Response:**
```json
{
  "routes": [
    {
      "distance_km": 750.45,
      "duration_min": 420.3,
      "emissions_grams": 187.61,
      "emission_level": "high",
      "eco_tag": "non_eco",
      "eco_points": 0,
      "carrier_type": "hybrid",
      "carrier_score": 0.75,
      "green_carrier": { ... }
    }
  ]
}
```

### 2. LLM-Powered Route Explanation

**Request:**
```json
POST /generate-explanation
{
  "route": { ... },  // Route object from /route-options
  "user_context": "User prefers eco-friendly options"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "explanation": "This is a quick trip covering 25.5 km. ...",
    "confidence": 0.8,
    "source": "llm"  // or "fallback"
  }
}
```

### 3. Reverse Logistics

**Request:**
```json
POST /reverse-logistics
{
  "deliveries": [{"id": "d1", "lat": 12.9716, "lon": 77.6413}],
  "returns": [{"id": "r1", "lat": 12.9750, "lon": 77.6450}]
}
```

---

## 🧑‍💻 Contribution Instructions

1. **Fork and clone** this repository.
2. **Create a new branch** for your feature or bugfix.
3. **Write clear, modular code** and add/modify tests as needed.
4. **Run all tests** before submitting a PR.
5. **Open a pull request** with a clear description of your changes.

**Guidelines:**
- Follow PEP8 and use type hints.
- Keep code modular (see existing structure).
- Document new endpoints and features in the README.
- For major changes, open an issue for discussion first.

---

## 🧩 Dependencies

- Python 3.7+
- FastAPI
- httpx
- openrouteservice
- python-dotenv
- pydantic
- uvicorn
- (see `requirements.txt` for full list)

---

## 🏆 Acknowledgements

- Built for the Walmart Sparkathon
- Uses [OpenRouteService](https://openrouteservice.org/) for route optimization

---

**RouteZero** – Making sustainable logistics the smart choice for tomorrow's retail ecosystem.

---
