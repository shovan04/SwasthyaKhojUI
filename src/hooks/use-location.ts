"use client";

import { useState, useEffect, useCallback } from 'react';
import type { LocationCoordinates } from '@/lib/types';

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
          // In a real app, you'd use a reverse geocoding service here
          // For now, we'll use a mock name based on coordinates or a default.
          setCurrentCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          // Simulate reverse geocoding
          setCurrentLocationName(`Lat: ${position.coords.latitude.toFixed(2)}, Lon: ${position.coords.longitude.toFixed(2)} (Detected)`);
          setIsLoading(false);
        },
        (err) => {
          console.warn(`ERROR(${err.code}): ${err.message}`);
          // Fallback to default if permission denied or error
          setCurrentLocationName(DEFAULT_LOCATION_NAME);
          setCurrentCoordinates(DEFAULT_COORDS);
          setError("Could not detect location. Showing default.");
          setIsLoading(false);
        }
      );
    } else {
      // Geolocation not supported or not in browser
      setCurrentLocationName(DEFAULT_LOCATION_NAME);
      setCurrentCoordinates(DEFAULT_COORDS);
      setError("Geolocation not supported. Showing default.");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserLocation();
  }, [fetchUserLocation]);

  const setManualLocation = useCallback((name: string, coords?: LocationCoordinates) => {
    setCurrentLocationName(name);
    setCurrentCoordinates(coords || DEFAULT_COORDS); // Use default if no coords provided
    setIsLoading(false);
    setError(null);
  }, []);

  return { currentLocationName, currentCoordinates, isLoading, error, setManualLocation, refreshLocation: fetchUserLocation };
}
