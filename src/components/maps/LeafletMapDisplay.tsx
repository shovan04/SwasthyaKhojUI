
"use client";

import type { FC } from 'react';
import { useEffect, useRef } from 'react';
// import L from 'leaflet'; // Moved L import to useEffect to ensure client-side only
import 'leaflet/dist/leaflet.css';
import type { LocationCoordinates, Facility } from '@/lib/types';
import { useRouter } from 'next/navigation';
import type L from 'leaflet'; // Import type for L


// Props type needs to be exported for dynamic import
export interface LeafletMapDisplayProps {
  centerCoordinates: LocationCoordinates | null;
  facilities: Facility[];
  userLocationName?: string | null;
}

const LeafletMapDisplay: FC<LeafletMapDisplayProps> = ({ centerCoordinates, facilities, userLocationName }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const facilityMarkersRef = useRef<L.Marker[]>([]);
  const router = useRouter();
  const LRef = useRef<typeof L | null>(null); // Ref to hold Leaflet 'L' object

  useEffect(() => {
    // Dynamically import Leaflet 'L' object only on the client side
    import('leaflet').then(leaflet => {
      LRef.current = leaflet.default; // leaflet.default because L is the default export

      // Fix for default Leaflet icon path issue with Webpack/Next.js
      // This needs to run after L is defined.
      delete (LRef.current.Icon.Default.prototype as any)._getIconUrl;
      LRef.current.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });


      if (!mapContainerRef.current || !centerCoordinates || !LRef.current) {
        return;
      }
      const currentL = LRef.current;


      // Initialize map only once
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = currentL.map(mapContainerRef.current).setView(
          [centerCoordinates.latitude, centerCoordinates.longitude],
          13
        );

        currentL.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapInstanceRef.current);
      } else {
        // If map already exists, just update its view
        mapInstanceRef.current.setView([centerCoordinates.latitude, centerCoordinates.longitude], 13);
      }

      // Update or add user marker
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([centerCoordinates.latitude, centerCoordinates.longitude]);
      } else {
        userMarkerRef.current = currentL.marker([centerCoordinates.latitude, centerCoordinates.longitude], {
          icon: currentL.icon({ // Custom user icon
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', // Or a custom blue icon
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          }),
        }).addTo(mapInstanceRef.current);
      }
      userMarkerRef.current.bindPopup(userLocationName || 'Your Location').openPopup();


      // Clear existing facility markers
      facilityMarkersRef.current.forEach(marker => marker.remove());
      facilityMarkersRef.current = [];

      // Add new facility markers
      facilities.forEach(facility => {
        let facilityCoords: L.LatLngTuple | null = null;

        if (facility.coordinates) {
          facilityCoords = [facility.coordinates.latitude, facility.coordinates.longitude];
        } else {
          console.warn(`Facility ${facility.name} missing coordinates, cannot display on map.`);
          return;
        }
        
        if(facilityCoords) {
          const facilityIcon = currentL.icon({
            iconUrl: facility.type === 'hospital' 
              ? 'https://cdnjs.cloudflare.com/ajax/libs/leaflet-color-markers/0.6.0/img/marker-icon-red.png' // Red for hospitals
              : 'https://cdnjs.cloudflare.com/ajax/libs/leaflet-color-markers/0.6.0/img/marker-icon-green.png', // Green for medical stores
            iconRetinaUrl: facility.type === 'hospital'
              ? 'https://cdnjs.cloudflare.com/ajax/libs/leaflet-color-markers/0.6.0/img/marker-icon-2x-red.png'
              : 'https://cdnjs.cloudflare.com/ajax/libs/leaflet-color-markers/0.6.0/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet-color-markers/0.6.0/img/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });

          const marker = currentL.marker(facilityCoords, { icon: facilityIcon }).addTo(mapInstanceRef.current!);
          const detailLink = facility.type === 'hospital' ? `/hospitals/${facility.id}` : `/medical-stores/${facility.id}`;
          
          marker.bindPopup(`<b>${facility.name}</b><br>${facility.address}<br/><a href="${detailLink}" style="color:hsl(var(--primary));text-decoration:underline;">View Details</a>`);
          facilityMarkersRef.current.push(marker);
        }
      });
    }).catch(error => console.error("Failed to load Leaflet", error));
    
    // Cleanup function (optional, as dynamic import handles some aspects)
    return () => {
      // if (mapInstanceRef.current) {
      // mapInstanceRef.current.remove(); // This might be too aggressive if component re-renders often
      // mapInstanceRef.current = null;
      // }
    };
  }, [centerCoordinates, facilities, userLocationName]); // Removed router as it wasn't used directly in this effect for map logic

  if (!centerCoordinates) {
    return (
      <div className="flex items-center justify-center h-64 md:h-96 bg-muted rounded-lg shadow">
        <p className="text-muted-foreground">Detecting location for map...</p>
      </div>
    );
  }

  return (
    <div 
      ref={mapContainerRef} 
      className="h-64 md:h-96 w-full rounded-lg shadow-md"
      data-ai-hint="interactive map" 
    />
  );
};

export default LeafletMapDisplay;

