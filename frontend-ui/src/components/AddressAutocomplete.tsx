import React, { useRef, useEffect } from 'react';
import { LoadScript } from '@react-google-maps/api';

interface Props {
    apiKey: string;
    onSelect: (address: string) => void;
}

const libraries: ("places")[] = ['places'];

const AddressAutocomplete = ({ apiKey, onSelect }: Props) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

    useEffect(() => {
        const initSearchBox = () => {
            if (inputRef.current && window.google?.maps?.places) {
                searchBoxRef.current = new window.google.maps.places.SearchBox(inputRef.current);

                searchBoxRef.current.addListener('places_changed', () => {
                    const places = searchBoxRef.current?.getPlaces();
                    if (places && places.length > 0) {
                        const place = places[0];
                        const latLng = place.geometry?.location;
                        const address =
                            place.formatted_address ??
                            place.name ??
                            (latLng && typeof latLng.lat === 'function' && typeof latLng.lng === 'function'
                                ? `${latLng.lat()},${latLng.lng()}`
                                : '');

                        if (address) {
                            onSelect(address);
                        }
                    }
                });

            }
        };

        // Wait until Google Maps script is loaded
        if (window.google?.maps?.places) {
            initSearchBox();
        } else {
            const interval = setInterval(() => {
                if (window.google?.maps?.places) {
                    clearInterval(interval);
                    initSearchBox();
                }
            }, 100);
        }
    }, [onSelect]);

    return (
        <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
            <input
                ref={inputRef}
                type="text"
                placeholder="Search address with Google Maps..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0071dc] focus:border-transparent"
            />
        </LoadScript>
    );
};

export default AddressAutocomplete;
