
"use client";

import { useLocation } from '@/hooks/use-location';
import { MapPreview } from '@/components/details/MapPreview';
import { EntityCard } from '@/components/home/EntityCard';
import { mockHospitals, mockMedicalStores } from '@/lib/data';
import type { Facility } from '@/lib/types';
import { Loader2, MapPin, Hospital as HospitalIcon, Store as StoreIcon } from 'lucide-react'; // Renamed icons to avoid conflict
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function MapsPage() {
  const { currentLocationName, isLoading: isLoadingLocation, error: locationError } = useLocation();

  // Loading state for location
  if (isLoadingLocation && !currentLocationName) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-9rem)] p-4 text-center"> {/* Adjusted for header and bottom nav */}
        <Loader2 className="w-12 h-12 text-primary mb-4 animate-spin" />
        <p className="text-lg text-muted-foreground">Loading map and nearby facilities...</p>
      </div>
    );
  }

  const mapPreviewImageUrl = `https://picsum.photos/seed/${encodeURIComponent(currentLocationName || 'defaultmapseed')}/800/400`;

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl space-y-8">
      {locationError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Location Error</AlertTitle>
          <AlertDescription>{locationError} Showing default lists.</AlertDescription>
        </Alert>
      )}
      
      {/* Map View Section */}
      <section>
        <div className="flex items-center mb-4">
          <MapPin className="w-6 h-6 text-primary mr-3 shrink-0" />
          <h1 className="text-2xl font-semibold text-primary-foreground">
            Your Current Area: {currentLocationName || (isLoadingLocation ? "Loading..." : "Default Area")}
          </h1>
        </div>
        <MapPreview 
          imageUrl={mapPreviewImageUrl} 
          altText={`Map of ${currentLocationName || 'current area'}`} 
        />
      </section>

      {/* Nearby Hospitals Section */}
      <section>
        <div className="flex items-center mb-4">
          <HospitalIcon className="w-6 h-6 text-primary mr-3 shrink-0" />
          <h2 className="text-xl font-semibold text-primary-foreground">Nearby Hospitals</h2>
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

      {/* Nearby Medical Stores Section */}
      <section>
        <div className="flex items-center mb-4">
          <StoreIcon className="w-6 h-6 text-primary mr-3 shrink-0" />
          <h2 className="text-xl font-semibold text-primary-foreground">Nearby Medical Stores</h2>
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
