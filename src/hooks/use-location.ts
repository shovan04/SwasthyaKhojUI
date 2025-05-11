
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
        'User-Agent': 'SwasthyaKhojApp/1.0 (swasthyakhoj.app@example.com)' // Replace with your app info and contact
      }
    });
    if (!response.ok) {
      throw new Error(`Nominatim API request failed with status ${response.status}`);
    }
    const data = await response.json();

    if (data && data.address) {
      const { road, village, town, city, suburb, neighbourhood, quarter, county, state } = data.address;
      // Prioritize specific location parts for a shorter name
      if (village) return village;
      if (town) return town;
      if (suburb) return suburb;
      if (neighbourhood) return neighbourhood;
      if (quarter) return quarter;
      if (road) return road; // Road can sometimes be too specific or long, so placed after others
      if (city) return city;
      
      // Fallback to more general parts if specific ones are not available, taking the first part.
      const generalName = [county, state, data.display_name?.split(',')[0].trim()].filter(Boolean).join(', ');
      if (generalName) return generalName.split(',')[0].trim();

      return "Location Name Not Found";

    } else if (data && data.display_name) {
      // Fallback to the first part of display_name if address object is missing
      return data.display_name.split(',')[0].trim();
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
        setCurrentCoordinates(coords);
        
        try {
          const areaName = await getAreaNameFromCoordinates(coords);
          setCurrentLocationName(areaName);
        } catch (geocodeError) {
          console.error("Reverse geocoding failed:", geocodeError);
          setCurrentLocationName(`Detected: Lat ${coords.latitude.toFixed(2)}, Lon ${coords.longitude.toFixed(2)}`);
          setError("Could not fetch area name.");
        }
        
      } catch (err: any) {
        console.warn(`Geolocation ERROR(${err.code}): ${err.message}`);
        if (isInitialLoad || !currentLocationName) { // Only set default if it's initial or no name yet
            setCurrentLocationName(DEFAULT_LOCATION_NAME);
            setCurrentCoordinates(DEFAULT_COORDS);
        }
        if (err.code === 1) { 
          setError("Location permission denied. Using current or default.");
        } else {
          setError("Could not detect location. Using current or default.");
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      if (isInitialLoad || !currentLocationName) {
        setCurrentLocationName(DEFAULT_LOCATION_NAME);
        setCurrentCoordinates(DEFAULT_COORDS);
      }
      setError("Geolocation not supported. Using current or default.");
      setIsLoading(false);
    }
  }, [currentLocationName]);

  useEffect(() => {
    // Fetch location only if it hasn't been set yet (e.g., on initial load)
    if (currentLocationName === null) {
      fetchUserLocation(true); // Pass true for initial load
    } else {
      setIsLoading(false); // If already have a location, not loading
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount or when fetchUserLocation changes (which it shouldn't often)

  const setManualLocation = useCallback(async (name: string, coords?: LocationCoordinates) => {
    setIsLoading(true);
    setCurrentLocationName(name);
    if (coords) {
      setCurrentCoordinates(coords);
    } else {
      setCurrentCoordinates(null); 
      console.warn("Manual location set without coordinates.");
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
            setCurrentLocationName(areaName);
            return areaName; 
        } catch (err: any) {
            console.warn("Error detecting location for modal update:", err);
            const fallbackName = currentLocationName || DEFAULT_LOCATION_NAME;
            setCurrentLocationName(fallbackName); 
            if (!currentCoordinates && !currentLocationName) setCurrentCoordinates(DEFAULT_COORDS);

            if (err.code === 1) {
              setError("Location permission denied by user.");
            } else {
              setError("Could not detect location for update.");
            }
            return fallbackName;
        } finally {
            setIsLoading(false);
        }
    } else {
        const fallbackName = currentLocationName || DEFAULT_LOCATION_NAME;
        setCurrentLocationName(fallbackName);
        if (!currentCoordinates && !currentLocationName) setCurrentCoordinates(DEFAULT_COORDS);
        setError("Geolocation not supported.");
        setIsLoading(false);
        return fallbackName;
    }
  }, [setIsLoading, setError, setCurrentCoordinates, setCurrentLocationName, currentLocationName, currentCoordinates]);


  return { 
    currentLocationName, 
    currentCoordinates, 
    isLoading, 
    error, 
    setManualLocation, 
    refreshLocation: () => fetchUserLocation(false), // Pass false for non-initial refresh
    detectLocationForModal: handleDetectLocationAndUpdateModal 
  };
}

