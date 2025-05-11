"use client";

import type { LocationCoordinates } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';

const DEFAULT_LOCATION_NAME = "Villupuram, Tamil Nadu"; // Example default location
const DEFAULT_COORDS: LocationCoordinates = { latitude: 11.9416, longitude: 79.4950 };

class GeocodingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeocodingError";
  }
}

// Reverse geocoding function using OpenStreetMap Nominatim API
async function getAreaNameFromCoordinates(coords: LocationCoordinates): Promise<string> {
  if (!coords || typeof coords.latitude !== 'number' || typeof coords.longitude !== 'number') {
    console.error("Invalid coordinates provided for reverse geocoding:", coords);
    throw new GeocodingError("Invalid coordinates for reverse geocoding.");
  }

  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&addressdetails=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SwasthyaKhojApp/1.0 (swasthyakhoj.app@example.com)' // Replace with your app info and contact
      }
    });
    if (!response.ok) {
      throw new GeocodingError(`Nominatim API request failed: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();

    if (data && data.error) { // Nominatim can return an error object in its response
        throw new GeocodingError(`Nominatim API error: ${data.error}`);
    }

    if (data && data.address) {
      const { road, village, town, city, suburb, neighbourhood, quarter, county, state, country } = data.address;
      // Prioritize specific location parts for a shorter name, as requested (village/town first)
      const preferredOrder = [village, town, neighbourhood, suburb, quarter, city, road];
      for (const part of preferredOrder) {
        if (part && part.trim() !== '') return part.trim();
      }
      
      // If none of the preferred parts are found, construct a broader name from county, state, country
      const broaderNameParts = [county, state, country].filter(p => p && p.trim() !== '');
      if (broaderNameParts.length > 0) return broaderNameParts.join(', ');
      
      // Fallback to the first part of display_name if address object processing yields nothing significant
      if (data.display_name) return data.display_name.split(',')[0].trim();
    }
    // If parsing fails or address object is missing/empty
    throw new GeocodingError("Could not parse area name from geocoding response.");

  } catch (error) {
    console.error("Error during getAreaNameFromCoordinates:", error);
    if (error instanceof GeocodingError) {
      throw error; // Re-throw specific geocoding errors
    }
    // For other unexpected errors (e.g. network issues before response.ok check, or JSON parsing issues)
    throw new GeocodingError("An unexpected error occurred during the reverse geocoding process.");
  }
}


export function useLocation() {
  const [currentLocationName, setCurrentLocationName] = useState<string | null>(null);
  const [currentCoordinates, setCurrentCoordinates] = useState<LocationCoordinates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserLocation = useCallback(async (isInitialLoad = false) => {
    setIsLoading(true);
    setError(null);
    if (typeof window !== 'undefined' && navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000, enableHighAccuracy: true });
        });
        
        const coords: LocationCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCurrentCoordinates(coords); // Set coordinates as soon as they are fetched
        
        try { // Nested try for reverse geocoding
          const areaName = await getAreaNameFromCoordinates(coords);
          setCurrentLocationName(areaName);
        } catch (geocodeError: any) {
          console.error("Reverse geocoding failed during initial load:", geocodeError);
          setCurrentLocationName(`Area @ ${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`); // Fallback to Lat/Lon
          if (geocodeError instanceof GeocodingError) {
            setError(`Could not fetch area name: ${geocodeError.message}`);
          } else {
            setError("Could not fetch area name due to an unexpected error.");
          }
        }
        
      } catch (err: any) { // Catch for navigator.geolocation.getCurrentPosition errors
        console.warn(`Geolocation ERROR(${err.code}) during initial load: ${err.message}`);
        // If geolocation fails on initial load, always use default.
        setCurrentLocationName(DEFAULT_LOCATION_NAME);
        setCurrentCoordinates(DEFAULT_COORDS);

        if (err.code === 1) { 
          setError("Location permission denied. Using default location.");
        } else if (err.code === 2) {
          setError("Location information is unavailable. Check connection/GPS. Using default location.");
        } else if (err.code === 3) {
          setError("Request to get location timed out. Using default location.");
        } else {
          setError("Could not detect location. Using default location.");
        }
      } finally {
        setIsLoading(false);
      }
    } else { // Geolocation not supported by browser
      setCurrentLocationName(DEFAULT_LOCATION_NAME);
      setCurrentCoordinates(DEFAULT_COORDS);
      setError("Geolocation not supported. Using default location.");
      setIsLoading(false);
    }
  }, []); // Removed dependencies as it should reflect initial load logic and stable functions

  useEffect(() => {
    if (currentLocationName === null) { // Fetch only if no location is set yet
      fetchUserLocation(true);
    } else {
      setIsLoading(false); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const setManualLocation = useCallback(async (name: string, coords?: LocationCoordinates) => {
    setIsLoading(true);
    setCurrentLocationName(name);
    if (coords) {
      setCurrentCoordinates(coords);
    } else {
      // If setting manually without coords, perhaps nullify or use a known default if applicable
      setCurrentCoordinates(null); 
      console.warn("Manual location set without coordinates. Coordinates cleared.");
    }
    setIsLoading(false);
    setError(null);
  }, []);
  
  const handleDetectLocationAndUpdateModal = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const previousName = currentLocationName; // Store before attempting update
    const previousCoords = currentCoordinates;

    if (typeof window !== 'undefined' && navigator.geolocation) {
        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000, enableHighAccuracy: true });
            });
            const coords = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };
            setCurrentCoordinates(coords); // Update coordinates immediately
            const areaName = await getAreaNameFromCoordinates(coords);
            setCurrentLocationName(areaName);
            setIsLoading(false);
            return areaName; 
        } catch (err: any) {
            console.warn("Error in handleDetectLocationAndUpdateModal:", err);
            let finalErrorMsg: string;
            
            // Revert to previous valid state or default if previous was null
            const nameToSet = previousName || DEFAULT_LOCATION_NAME;
            setCurrentLocationName(nameToSet);

            if (err instanceof GeocodingError) {
                // Geolocation succeeded, reverse geocoding failed. Coords were set from this attempt.
                finalErrorMsg = `Could not get area name: ${err.message}. Using '${nameToSet}'.`;
            } else if (err && err.code) { // Geolocation API error
                // Coords from this attempt failed. Revert to previous or default coords.
                setCurrentCoordinates(previousCoords || (nameToSet === DEFAULT_LOCATION_NAME ? DEFAULT_COORDS : null));
                switch (err.code) {
                    case 1: finalErrorMsg = "Location permission denied. "; break;
                    case 2: finalErrorMsg = "Location information is unavailable. Check connection/GPS. "; break;
                    case 3: finalErrorMsg = "Request to get location timed out. "; break;
                    default: finalErrorMsg = "Could not detect location (geolocation error). ";
                }
                finalErrorMsg += `Using '${nameToSet}'.`;
            } else { // Other unexpected errors
                setCurrentCoordinates(previousCoords || (nameToSet === DEFAULT_LOCATION_NAME ? DEFAULT_COORDS : null));
                finalErrorMsg = `An unexpected error occurred while updating location. Using '${nameToSet}'.`;
            }
            
            setError(finalErrorMsg);
            setIsLoading(false);
            return nameToSet;
        }
    } else { // Geolocation not supported
        const nameToSet = previousName || DEFAULT_LOCATION_NAME;
        setCurrentLocationName(nameToSet);
        setCurrentCoordinates(previousCoords || (nameToSet === DEFAULT_LOCATION_NAME ? DEFAULT_COORDS : null));
        setError("Geolocation not supported.");
        setIsLoading(false);
        return nameToSet;
    }
  }, [currentLocationName, currentCoordinates]);


  return { 
    currentLocationName, 
    currentCoordinates, 
    isLoading, 
    error, 
    setManualLocation, 
    refreshLocation: () => fetchUserLocation(false), 
    detectLocationForModal: handleDetectLocationAndUpdateModal 
  };
}