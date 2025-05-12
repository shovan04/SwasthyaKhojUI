"use client";

import type { LocationCoordinates } from '@/lib/types';
import { useCallback, useEffect, useMemo, useState } from 'react';

const DEFAULT_LOCATION_NAME = "Villupuram, Tamil Nadu";
const DEFAULT_COORDS: LocationCoordinates = { latitude: 11.9416, longitude: 79.4950 };

class GeocodingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeocodingError";
  }
}

async function getAreaNameFromCoordinates(coords: LocationCoordinates): Promise<string> {
  if (!coords || typeof coords.latitude !== 'number' || typeof coords.longitude !== 'number') {
    throw new GeocodingError("Invalid coordinates for reverse geocoding.");
  }

  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&addressdetails=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SwasthyaKhojApp/1.0 (swasthya-khoj-ui.vercel.app)'
      }
    });

    if (!response.ok) {
      throw new GeocodingError(`Nominatim API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data?.error) {
      throw new GeocodingError(`Nominatim API error: ${data.error}`);
    }

    if (data?.address) {
      const {
        hamlet, locality, village, town, neighbourhood,
        suburb, quarter, city, road, county, state, country
      } = data.address;

      const preferredOrder = [village, town, hamlet, locality, neighbourhood, suburb, quarter, city, road];
      for (const part of preferredOrder) {
        if (part?.trim()) return part.trim();
      }

      const broaderNameParts = [county, state, country].filter(p => p?.trim());
      if (broaderNameParts.length > 0) return broaderNameParts.join(', ');

      if (data.display_name) return data.display_name.split(',')[0].trim();
    }

    throw new GeocodingError("Could not parse area name from geocoding response.");

  } catch (error) {
    console.error("Error during getAreaNameFromCoordinates:", error);
    throw error instanceof GeocodingError
      ? error
      : new GeocodingError("Unexpected error during reverse geocoding.");
  }
}

export function useLocation() {
  const [currentLocationName, setCurrentLocationName] = useState<string | null>(null);
  const [currentCoordinates, setCurrentCoordinates] = useState<LocationCoordinates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wasManuallySet, setWasManuallySet] = useState(false);

  const fetchUserLocation = useCallback(async (isInitialLoad = false) => {
    setIsLoading(true);
    setError(null);
    setWasManuallySet(false);

    if (typeof window !== 'undefined' && navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            // enableHighAccuracy: true 
          });
        });

        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setCurrentCoordinates(coords);

        try {
          const areaName = await getAreaNameFromCoordinates(coords);
          setCurrentLocationName(areaName);
        } catch (geocodeError: any) {
          setCurrentLocationName(`Area @ ${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`);
          setError(geocodeError.message || "Could not fetch area name.");
        }

      } catch (err: any) {
        setCurrentLocationName(DEFAULT_LOCATION_NAME);
        setCurrentCoordinates(DEFAULT_COORDS);
        switch (err.code) {
          case 1:
            setError("Location permission denied. Using default location.");
            break;
          case 2:
            setError("Location unavailable. Using default location.");
            break;
          case 3:
            setError("Location request timed out. Using default location.");
            break;
          default:
            setError("Could not detect location. Using default.");
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setCurrentLocationName(DEFAULT_LOCATION_NAME);
      setCurrentCoordinates(DEFAULT_COORDS);
      setError("Geolocation not supported. Using default location.");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentLocationName === null) {
      fetchUserLocation(true);
    } else {
      setIsLoading(false);
    }
  }, [fetchUserLocation, currentLocationName]);

  const setManualLocation = useCallback(async (name: string, coords?: LocationCoordinates) => {
    setIsLoading(true);
    setCurrentLocationName(name);
    setCurrentCoordinates(coords ?? null);
    setWasManuallySet(true);
    setError(null);
    setIsLoading(false);
  }, []);

  const handleDetectLocationAndUpdateModal = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setWasManuallySet(false);

    const previousName = currentLocationName;
    const previousCoords = currentCoordinates;

    if (typeof window !== 'undefined' && navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true
          });
        });

        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setCurrentCoordinates(coords);

        const areaName = await getAreaNameFromCoordinates(coords);
        setCurrentLocationName(areaName);
        setIsLoading(false);
        return areaName;

      } catch (err: any) {
        const fallbackName = previousName || DEFAULT_LOCATION_NAME;
        const fallbackCoords = previousCoords || DEFAULT_COORDS;
        setCurrentLocationName(fallbackName);
        setCurrentCoordinates(fallbackCoords);

        let msg = "An error occurred.";
        if (err instanceof GeocodingError) {
          msg = `Could not get area name: ${err.message}. Using '${fallbackName}'.`;
        } else if (err.code) {
          switch (err.code) {
            case 1: msg = "Location permission denied."; break;
            case 2: msg = "Location unavailable."; break;
            case 3: msg = "Location request timed out."; break;
            default: msg = "Geolocation error."; break;
          }
          msg += ` Using '${fallbackName}'.`;
        }

        setError(msg);
        setIsLoading(false);
        return fallbackName;
      }
    } else {
      setCurrentLocationName(previousName || DEFAULT_LOCATION_NAME);
      setCurrentCoordinates(previousCoords || DEFAULT_COORDS);
      setError("Geolocation not supported.");
      setIsLoading(false);
      return previousName || DEFAULT_LOCATION_NAME;
    }
  }, [currentLocationName, currentCoordinates]);

  return {
    currentLocationName,
    currentCoordinates,
    isLoading,
    error,
    wasManuallySet,
    setManualLocation,
    refreshLocation: () => fetchUserLocation(false),
    detectLocationForModal: handleDetectLocationAndUpdateModal
  };
}
