"use client";

import { useState } from 'react';
import { MapPin, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationModal } from '@/components/shared/LocationModal';
import { Skeleton } from '@/components/ui/skeleton';
import { Logo } from '../shared/Logo';

interface AppHeaderProps {
  currentLocationName: string | null;
  isLoadingLocation: boolean;
  onSetLocation: (locationName: string) => void;
  onDetectLocation: () => void;
}

export function AppHeader({
  currentLocationName,
  isLoadingLocation,
  onSetLocation,
  onDetectLocation,
}: AppHeaderProps) {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Logo className="hidden sm:flex" />
        <div className="sm:hidden text-lg font-semibold text-primary">SwasthyaKhoj</div>


        <div className="flex items-center space-x-2">
          {isLoadingLocation ? (
            <Skeleton className="h-6 w-32 rounded-md" />
          ) : (
            <Button
              variant="ghost"
              className="text-sm text-muted-foreground hover:text-foreground px-2 sm:px-3"
              onClick={() => setIsLocationModalOpen(true)}
              title="Change location"
            >
              <MapPin className="h-4 w-4 sm:mr-1 shrink-0" />
              <span className="truncate max-w-[100px] sm:max-w-[150px] hidden sm:inline">
                {currentLocationName || 'Set Location'}
              </span>
              <Edit3 className="h-3 w-3 ml-1 sm:ml-2 text-muted-foreground/70 shrink-0" />
            </Button>
          )}
        </div>
      </div>
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocationName={currentLocationName}
        onSetLocation={onSetLocation}
        onDetectLocation={onDetectLocation}
      />
    </header>
  );
}
