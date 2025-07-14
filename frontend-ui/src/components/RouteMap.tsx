import React, { useEffect, useState } from 'react';
import {
  GoogleMap,
  LoadScript,
  DirectionsRenderer,
  DirectionsService,
} from '@react-google-maps/api';

interface Props {
  apiKey: string;
  destination: string;
}

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '1rem',
};

const indiaWalmartHubs = [
  { name: 'Walmart Hub Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Walmart Hub Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Walmart Hub Hyderabad', lat: 17.3850, lng: 78.4867 },
];

const RouteMap = ({ apiKey, destination }: Props) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [directionsRequested, setDirectionsRequested] = useState(false);

  const [origin] = useState(() => {
    const index = Math.floor(Math.random() * indiaWalmartHubs.length);
    return indiaWalmartHubs[index];
  });

  const [mapLoaded, setMapLoaded] = useState(false);

  const handleDirectionsCallback = (
    response: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === 'OK' && response) {
      setDirections(response);
    } else {
      console.error('Directions request failed:', status, response);
    }
  };

  // Reset direction request if destination changes
  useEffect(() => {
    setDirectionsRequested(false);
    setDirections(null);
  }, [destination]);

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={6}
        center={{ lat: origin.lat, lng: origin.lng }}
        onLoad={() => setMapLoaded(true)}
      >
        {mapLoaded && destination && !directionsRequested && (
          <DirectionsService
            options={{
              origin,
              destination,
              travelMode: google.maps.TravelMode.DRIVING,
            }}
            callback={(res, status) => {
              handleDirectionsCallback(res, status);
              setDirectionsRequested(true); // ✅ Prevent re-calls
            }}
          />
        )}

        {directions && (
          <DirectionsRenderer
            options={{
              directions,
              suppressMarkers: false,
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default RouteMap;
