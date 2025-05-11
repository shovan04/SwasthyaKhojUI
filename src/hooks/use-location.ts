
"use client";

import type { LocationCoordinates } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';

const DEFAULT_LOCATION_NAME = "Villupuram, Tamil Nadu"; // Example default location
const DEFAULT_COORDS: LocationCoordinates = { latitude: 11.9416, longitude: 79.4950 };

// Mock reverse geocoding function
async function getAreaNameFromCoordinates(coords: LocationCoordinates): Promise<string> {
  // In a real app, you would call a reverse geocoding API here.
  // For this example, we'll return a mock name.
  // This is a simplified mock. A real implementation would be more complex.
  console.log('Reverse geocoding for:', coords);
  if (coords.latitude === DEFAULT_COORDS.latitude && coords.longitude === DEFAULT_COORDS.longitude) {
    return "Villupuram City Center";
  }
  // Simulate a slight variation for detected locations
  if (coords.latitude && coords.longitude) {
    return `Area near Lat ${coords.latitude.toFixed(2)}, Lon ${coords.longitude.toFixed(2)}`;
  }
  return "Unknown Area";
}


export function useLocation() {
  const [currentLocationName, setCurrentLocationName] = useState<string | null>(null);
  const [currentCoordinates, setCurrentCoordinates] = useState<LocationCoordinates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    if (typeof window !== 'undefined' && navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
        });
        
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCurrentCoordinates(coords);
        
        try {
          const areaName = await getAreaNameFromCoordinates(coords);
          setCurrentLocationName(areaName);
        } catch (geocodeError) {
          console.error("Reverse geocoding failed:", geocodeError);
          setCurrentLocationName("Detected Location (Area name unavailable)");
          setError("Could not fetch area name.");
        }
        
        setIsLoading(false);
      } catch (err: any) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        // Fallback to default if permission denied or error
        setCurrentLocationName(DEFAULT_LOCATION_NAME);
        setCurrentCoordinates(DEFAULT_COORDS);
        setError("Could not detect location. Using default.");
        setIsLoading(false);
      }
    } else {
      // Geolocation not supported or not in browser
      setCurrentLocationName(DEFAULT_LOCATION_NAME);
      setCurrentCoordinates(DEFAULT_COORDS);
      setError("Geolocation not supported. Using default.");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch location if a name hasn't been set yet (e.g., by manual input or persistence)
    if (currentLocationName === null) {
      fetchUserLocation();
    } else {
      // If a location name is already present, ensure loading state is false.
      setIsLoading(false);
    }
    // Adding currentLocationName to dependency array to correctly handle cases where it might be set by other means.
    // The 'if (currentLocationName === null)' check prevents re-fetching if it's already set.
  }, [fetchUserLocation, currentLocationName]);

  const setManualLocation = useCallback((name: string, coords?: LocationCoordinates) => {
    setCurrentLocationName(name);
    // If coords are not provided with manual location, we might want to clear them or use a default.
    // For now, let's keep existing or use default if name implies new search.
    setCurrentCoordinates(coords || null); 
    setIsLoading(false);
    setError(null);
  }, []);

  return { currentLocationName, currentCoordinates, isLoading, error, setManualLocation, refreshLocation: fetchUserLocation };
}
