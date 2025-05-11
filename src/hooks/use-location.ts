
"use client";

import type { LocationCoordinates } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';

const DEFAULT_LOCATION_NAME = "Villupuram, Tamil Nadu"; // Example default location
const DEFAULT_COORDS: LocationCoordinates = { latitude: 11.9416, longitude: 79.4950 };


export function useLocation() {
  const [currentLocationName, setCurrentLocationName] = useState<string | null>(null);
  const [currentCoordinates, setCurrentCoordinates] = useState<LocationCoordinates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserLocation = useCallback(() => {
    setIsLoading(true);
    setError(null);
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCurrentCoordinates(coords);
          // Set a more user-friendly name for detected location
          setCurrentLocationName(`Your Current Area (Detected)`);
          setIsLoading(false);
        },
        (err) => {
          console.warn(`ERROR(${err.code}): ${err.message}`);
          // Fallback to default if permission denied or error
          setCurrentLocationName(DEFAULT_LOCATION_NAME);
          setCurrentCoordinates(DEFAULT_COORDS);
          setError("Could not detect location. Using default.");
          setIsLoading(false);
        }
      );
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
    setCurrentCoordinates(coords || DEFAULT_COORDS); // Use provided coords or fallback to default
    setIsLoading(false);
    setError(null);
  }, []);

  return { currentLocationName, currentCoordinates, isLoading, error, setManualLocation, refreshLocation: fetchUserLocation };
}

