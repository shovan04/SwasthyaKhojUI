"use client";

import { useState, useMemo } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { SearchAndFilter } from '@/components/home/SearchAndFilter';
import { EntityCard } from '@/components/home/EntityCard';
import { HomeActionsGrid } from '@/components/home/HomeActionsGrid';
import { mockMedicalStores, mockHospitals } from '@/lib/data';
import type { Facility } from '@/lib/types';
import { useLocation } from '@/hooks/use-location';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { 
    currentLocationName, 
    isLoading: isLoadingLocation, 
    error: locationError, 
    setManualLocation,
    detectLocationForModal
  } = useLocation();

  const filteredMedicalStores = useMemo(() => {
    if (!searchTerm) return mockMedicalStores;
    return mockMedicalStores.filter(store =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const filteredHospitals = useMemo(() => {
    if (!searchTerm) return mockHospitals;
    return mockHospitals.filter(hospital =>
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader 
        currentLocationName={currentLocationName}
        isLoadingLocation={isLoadingLocation}
        onSetLocation={setManualLocation}
        onDetectLocation={detectLocationForModal}
      />
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onFilterClick={() => { /* Implement filter logic if needed */ }}
      />
      
      <HomeActionsGrid />

      <div className="container mx-auto px-4 py-6 max-w-5xl flex-grow">
        {locationError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Location Error</AlertTitle>
            <AlertDescription>{locationError}</AlertDescription>
          </Alert>
        )}

        {isLoadingLocation && !currentLocationName && (
           <div className="flex flex-col items-center justify-center text-center py-10">
             <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
             <p className="text-lg text-muted-foreground">Detecting your location...</p>
           </div>
        )}

        <section className="mb-8" id="nearby-facilities">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-primary-foreground">আপনার কাছাকাছি</h2>
            <Button variant="link" className="text-sm text-primary">সব দেখুন</Button>
          </div>

          <Tabs defaultValue="hospitals" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="hospitals" id="hospitals-nearby">হাসপাতাল</TabsTrigger>
              <TabsTrigger value="medical-stores" id="medical-stores-nearby">মেডিক্যাল স্টোর</TabsTrigger>
            </TabsList>
            <TabsContent value="hospitals">
              {filteredHospitals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredHospitals.map(hospital => (
                    <EntityCard key={hospital.id} entity={hospital as Facility} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No hospitals found matching your search.</p>
              )}
            </TabsContent>
            <TabsContent value="medical-stores">
              {filteredMedicalStores.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredMedicalStores.map(store => (
                    <EntityCard key={store.id} entity={store as Facility} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No medical stores found matching your search.</p>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
}
