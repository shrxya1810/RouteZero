import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Props {
  apiKey: string;
  destination: string;
}

interface RouteType {
  id: string;
  name: string;
  color: string;
  carbonEmission: number;
  estimatedTime: string;
  description: string;
}

const routeTypes: RouteType[] = [
  {
    id: 'eco',
    name: 'Eco-Friendly Route',
    color: '#22c55e',
    carbonEmission: 0.5,
    estimatedTime: '2-3 days',
    description: 'Uses electric vehicles and optimized paths'
  },
  {
    id: 'hybrid',
    name: 'Balanced Route',
    color: '#f59e0b',
    carbonEmission: 1.2,
    estimatedTime: '1-2 days',
    description: 'Good balance of speed and environmental impact'
  },
  {
    id: 'express',
    name: 'Express Route',
    color: '#ef4444',
    carbonEmission: 3.8,
    estimatedTime: 'Same day',
    description: 'Fastest delivery with standard vehicles'
  }
];

const indiaWalmartHubs = [
  { name: 'Walmart Hub Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Walmart Hub Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Walmart Hub Hyderabad', lat: 17.3850, lng: 78.4867 },
];

const RouteMap = ({ apiKey, destination }: Props) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<[number, number] | null>(null);
  const [routes, setRoutes] = useState<{ [key: string]: [number, number][] }>({});

  const [origin] = useState(() => {
    const index = Math.floor(Math.random() * indiaWalmartHubs.length);
    return indiaWalmartHubs[index];
  });

  // Function to geocode address using OpenStreetMap Nominatim
  const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
    try {
      // First try with the address as-is
      let response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=in`
      );
      let data = await response.json();
      
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }

      // If not found, try with "India" appended
      response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ', India')}&limit=1`
      );
      data = await response.json();
      
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }

      // If still not found, return a default location in India for demo
      return [20.5937, 78.9629]; // Center of India
    } catch (error) {
      console.error('Geocoding error:', error);
      return [20.5937, 78.9629]; // Default to center of India
    }
  };

  // Function to generate multiple routes with variations
  const generateRoutes = (start: [number, number], end: [number, number]) => {
    const routes: { [key: string]: [number, number][] } = {};
    
    // Generate different route paths with random intermediate points
    routeTypes.forEach((routeType, index) => {
      const route: [number, number][] = [start];
      
      // Add intermediate waypoints to simulate different route paths
      const latDiff = end[0] - start[0];
      const lngDiff = end[1] - start[1];
      
      for (let i = 1; i < 4; i++) {
        const progress = i / 4;
        const variation = (index - 1) * 0.3; // Different routes take different paths
        
        const lat = start[0] + latDiff * progress + variation * Math.sin(progress * Math.PI);
        const lng = start[1] + lngDiff * progress + variation * Math.cos(progress * Math.PI);
        
        route.push([lat, lng]);
      }
      
      route.push(end);
      routes[routeType.id] = route;
    });
    
    return routes;
  };

  useEffect(() => {
    if (!destination) {
      setLoading(false);
      setDestinationCoords(null);
      setRoutes({});
      return;
    }

    setLoading(true);
    setError(null);

    // Geocode the destination
    geocodeAddress(destination)
      .then(coords => {
        if (coords) {
          setDestinationCoords(coords);
          // Generate multiple routes from origin to destination
          const generatedRoutes = generateRoutes([origin.lat, origin.lng], coords);
          setRoutes(generatedRoutes);
        } else {
          setError('Could not find destination location');
        }
      })
      .catch(err => {
        setError('Error finding destination');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [destination, origin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="text-gray-600">Loading map...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
        <div className="text-red-600 text-center px-4">{error}</div>
      </div>
    );
  }

  if (!destination || !destinationCoords) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-gray-500">Enter a destination to see the route</div>
      </div>
    );
  }

  // Calculate center point between origin and destination
  const centerLat = (origin.lat + destinationCoords[0]) / 2;
  const centerLng = (origin.lng + destinationCoords[1]) / 2;

  return (
    <div className="space-y-4">
      {/* Route Legend */}
      <div className="flex flex-wrap gap-2 text-sm">
        {routeTypes.map((routeType) => (
          <div key={routeType.id} className="flex items-center gap-2">
            <div 
              className="w-4 h-1 rounded" 
              style={{ backgroundColor: routeType.color }}
            />
            <span>{routeType.name}</span>
            <span className="text-gray-500">({routeType.carbonEmission}kg CO₂)</span>
          </div>
        ))}
      </div>

      {/* Map */}
      <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Origin marker */}
          <Marker position={[origin.lat, origin.lng]}>
            <Popup>
              <div className="text-center">
                <strong>{origin.name}</strong><br />
                📦 Pickup Location
              </div>
            </Popup>
          </Marker>

          {/* Destination marker */}
          <Marker position={destinationCoords}>
            <Popup>
              <div className="text-center">
                <strong>Delivery Address</strong><br />
                🏠 {destination}
              </div>
            </Popup>
          </Marker>

          {/* Multiple route lines */}
          {routeTypes.map((routeType) => {
            const routeCoords = routes[routeType.id];
            if (!routeCoords || routeCoords.length === 0) return null;

            return (
              <Polyline
                key={routeType.id}
                positions={routeCoords}
                color={routeType.color}
                weight={4}
                opacity={0.8}
              >
                <Tooltip permanent={false} direction="center" offset={[0, 0]}>
                  <div className="bg-white p-2 rounded shadow-lg text-sm">
                    <div className="font-semibold text-gray-800">{routeType.name}</div>
                    <div className="text-gray-600">{routeType.description}</div>
                    <div className="flex justify-between mt-1">
                      <span className="text-green-600">🌱 {routeType.carbonEmission}kg CO₂</span>
                      <span className="text-blue-600">⏱️ {routeType.estimatedTime}</span>
                    </div>
                  </div>
                </Tooltip>
              </Polyline>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default RouteMap;
