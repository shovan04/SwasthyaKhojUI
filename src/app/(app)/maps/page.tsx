"use client";

import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import { useLocation } from '@/hooks/use-location';
import LeafletMapDisplay from '@/components/maps/LeafletMapDisplay'; // Import the new Leaflet map component
import { EntityCard } from '@/components/home/EntityCard';
import { mockHospitals, mockMedicalStores, allFacilities } from '@/lib/data'; // Use allFacilities
import type { Facility } from '@/lib/types';
import { Loader2, MapPin, Hospital as HospitalIcon, Store as StoreIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function MapsPage() {
  const { currentLocationName, currentCoordinates, isLoading: isLoadingLocation, error: locationError } = useLocation();

  if (isLoadingLocation && !currentLocationName && !currentCoordinates) { // Check coords too
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem-4rem)] p-4 text-center">
        <Loader2 className="w-12 h-12 text-primary mb-4 animate-spin" />
        <p className="text-lg text-muted-foreground">Loading map and nearby facilities...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl space-y-8">
      {locationError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Location Error</AlertTitle>
          <AlertDescription>{locationError} Showing default lists or last known location.</AlertDescription>
        </Alert>
      )}
      
      <section>
        <div className="flex items-center mb-4">
          <MapPin className="w-6 h-6 text-primary mr-3 shrink-0" />
          <h1 className="text-2xl font-semibold">
            <span className="text-muted-foreground">Your Current Area: </span>
            <span className="text-primary">{currentLocationName || (isLoadingLocation ? "Detecting..." : "Default Area")}</span>
          </h1>
        </div>
        
        <LeafletMapDisplay 
          centerCoordinates={currentCoordinates} 
          facilities={allFacilities} 
          userLocationName={currentLocationName}
        />
      </section>

      <section>
        <div className="flex items-center mb-4">
          <HospitalIcon className="w-6 h-6 text-primary mr-3 shrink-0" />
          <h2 className="text-xl font-semibold text-foreground">Nearby Hospitals</h2>
        </div>
        {mockHospitals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockHospitals.map(hospital => (
              <EntityCard key={hospital.id} entity={hospital as Facility} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No hospitals found nearby.</p>
        )}
      </section>

      <section>
        <div className="flex items-center mb-4">
          <StoreIcon className="w-6 h-6 text-primary mr-3 shrink-0" />
          <h2 className="text-xl font-semibold text-foreground">Nearby Medical Stores</h2>
        </div>
        {mockMedicalStores.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockMedicalStores.map(store => (
              <EntityCard key={store.id} entity={store as Facility} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No medical stores found nearby.</p>
        )}
      </section>
    </div>
  );
}
