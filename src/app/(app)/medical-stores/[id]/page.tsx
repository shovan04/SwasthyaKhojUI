"use client";

import { useParams, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getFacilityById, mockMedicalStores } from '@/lib/data'; // Using mock for now
import type { MedicalStore } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Store, Clock, Info, ArrowLeft } from 'lucide-react';
import { MapPreview } from '@/components/details/MapPreview';
import { DoctorInfoCard } from '@/components/details/DoctorInfoCard';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function MedicalStoreDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [store, setStore] = useState<MedicalStore | null | undefined>(undefined); // undefined for loading state

  useEffect(() => {
    if (id) {
      // In a real app, fetch from API: const data = await fetchFacilityById(id);
      const data = getFacilityById(id) as MedicalStore | undefined;
      setStore(data);
    }
  }, [id]);

  if (store === undefined) { // Loading state
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-6 w-1/2 mb-6" />
        <Skeleton className="h-48 w-full mb-4" />
        <Skeleton className="h-24 w-full mb-4" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!store) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-0 sm:p-4 md:p-6">
       <div className="container mx-auto max-w-3xl bg-card shadow-xl rounded-lg overflow-hidden">
        <header className="p-4 sm:p-6 border-b">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/home">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <div className="flex items-center mb-2">
            <Store className="w-8 h-8 mr-3 text-primary" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground">{store.name}</h1>
              <p className="text-sm text-muted-foreground">Medical Store</p>
            </div>
          </div>
        </header>
        
        <MapPreview imageUrl={store.mapImageUrl} altText={`${store.name} map location`} />

        <div className="p-4 sm:p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Info className="mr-2 h-5 w-5 text-accent" />
                Store Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-base">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-1 text-muted-foreground shrink-0" />
                <p>{store.address}</p>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-muted-foreground shrink-0" />
                <a href={`tel:${store.phone}`} className="hover:underline">{store.phone}</a>
              </div>
              {store.services && store.services.length > 0 && (
                <div className="flex items-start">
                  <Clock className="w-5 h-5 mr-3 mt-1 text-muted-foreground shrink-0" />
                  <div>
                    <h3 className="font-medium text-sm mb-1">Services:</h3>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {store.services.map(service => <li key={service}>{service}</li>)}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {store.doctors && store.doctors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Available Doctors / Consultants</CardTitle>
              </CardHeader>
              <CardContent>
                {store.doctors.map(doc => <DoctorInfoCard key={doc.id} doctor={doc} />)}
              </CardContent>
            </Card>
          )}

          <div className="pt-4">
            <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
              <a href={`tel:${store.phone}`}>
                <Phone className="mr-2 h-5 w-5" /> Call to Book / Enquire
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
