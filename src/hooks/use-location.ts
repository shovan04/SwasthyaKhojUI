
"use client";

import type { LocationCoordinates } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';

const DEFAULT_LOCATION_NAME = "Villupuram, Tamil Nadu"; // Example default location
const DEFAULT_COORDS: LocationCoordinates = { latitude: 11.9416, longitude: 79.4950 };

// Reverse geocoding function using OpenStreetMap Nominatim API
async function getAreaNameFromCoordinates(coords: LocationCoordinates): Promise<string> {
  if (!coords || typeof coords.latitude !== 'number' || typeof coords.longitude !== 'number') {
    console.error("Invalid coordinates provided for reverse geocoding:", coords);
    return "Unknown Area (Invalid Coords)";
  }

  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&zoom=18&addressdetails=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SwasthyaKhojApp/1.0 (your-email@example.com)' // Replace with your app info and contact
      }
    });
    if (!response.ok) {
      throw new Error(`Nominatim API request failed with status ${response.status}`);
    }
    const data = await response.json();

    if (data && data.display_name) {
      return data.display_name;
    } else if (data && data.address) {
      // Fallback to constructing from address parts if display_name is not available
      const { road, suburb, city, town, village, county, state, country } = data.address;
      const parts = [road, suburb, city || town || village, county, state, country].filter(Boolean);
      return parts.join(', ') || "Unknown Location";
    }
    return "Area Name Not Found";
  } catch (error) {
    console.error("Error during reverse geocoding:", error);
    // Return a more user-friendly error or a generic name
    return `Area near Lat ${coords.latitude.toFixed(2)}, Lon ${coords.longitude.toFixed(2)}`;
  }
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
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000, enableHighAccuracy: true });
        });
        
        const coords: LocationCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCurrentCoordinates(coords);
        
        try {
          const areaName = await getAreaNameFromCoordinates(coords);
          setCurrentLocationName(areaName);
        } catch (geocodeError) {
          console.error("Reverse geocoding failed:", geocodeError);
          // If geocoding fails, still show that location was detected but name is unavailable.
          setCurrentLocationName(`Detected: Lat ${coords.latitude.toFixed(2)}, Lon ${coords.longitude.toFixed(2)}`);
          setError("Could not fetch area name.");
        }
        
      } catch (err: any) {
        console.warn(`Geolocation ERROR(${err.code}): ${err.message}`);
        // Fallback to default if permission denied or error
        setCurrentLocationName(DEFAULT_LOCATION_NAME);
        setCurrentCoordinates(DEFAULT_COORDS);
        if (err.code === 1) { // PERMISSION_DENIED
          setError("Location permission denied. Using default.");
        } else {
          setError("Could not detect location. Using default.");
        }
      } finally {
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
    if (currentLocationName === null) {
      fetchUserLocation();
    } else {
      setIsLoading(false);
    }
  }, [fetchUserLocation, currentLocationName]);

  const setManualLocation = useCallback(async (name: string, coords?: LocationCoordinates) => {
    setIsLoading(true);
    setCurrentLocationName(name);
    if (coords) {
      setCurrentCoordinates(coords);
    } else {
      // If no coords provided for manual name, try to geocode the name
      // This is a forward geocoding step, which is more complex.
      // For now, we'll just set the name and clear/keep coordinates.
      // In a real app, you'd call a forward geocoding API here.
      // For simplicity, if no coords, let's clear them.
      setCurrentCoordinates(null); 
      console.warn("Manual location set without coordinates. Consider implementing forward geocoding.");
    }
    setIsLoading(false);
    setError(null);
  }, []);
  
  const handleDetectLocationAndUpdateModal = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    if (typeof window !== 'undefined' && navigator.geolocation) {
        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000, enableHighAccuracy: true });
            });
            const coords = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };
            setCurrentCoordinates(coords);
            const areaName = await getAreaNameFromCoordinates(coords);
            setCurrentLocationName(areaName); // This will update the state used by the modal
            return areaName; // Return the name for the modal to use directly
        } catch (err) {
            console.warn("Error detecting location for modal update:", err);
            setCurrentLocationName(DEFAULT_LOCATION_NAME); // Fallback
            setCurrentCoordinates(DEFAULT_COORDS);
            setError("Could not detect location. Using default.");
            return DEFAULT_LOCATION_NAME;
        } finally {
            setIsLoading(false);
        }
    } else {
        setCurrentLocationName(DEFAULT_LOCATION_NAME);
        setCurrentCoordinates(DEFAULT_COORDS);
        setError("Geolocation not supported.");
        setIsLoading(false);
        return DEFAULT_LOCATION_NAME;
    }
  }, [setIsLoading, setError, setCurrentCoordinates, setCurrentLocationName]);


  return { 
    currentLocationName, 
    currentCoordinates, 
    isLoading, 
    error, 
    setManualLocation, 
    refreshLocation: fetchUserLocation,
    detectLocationForModal: handleDetectLocationAndUpdateModal 
  };
}
