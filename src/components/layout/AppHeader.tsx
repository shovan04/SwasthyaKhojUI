"use client";

import { useState } from 'react';
import { MapPin } from 'lucide-react'; // Removed Edit3 as it's not in the example's header style
import { Button } from '@/components/ui/button';
import { LocationModal } from '@/components/shared/LocationModal';
import { Skeleton } from '@/components/ui/skeleton';
import { Logo } from '../shared/Logo';

interface AppHeaderProps {
  currentLocationName: string | null;
  isLoadingLocation: boolean;
  onSetLocation: (locationName: string) => void;
  onDetectLocation: () => Promise<string | void>;
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
      <div className="container flex h-20 items-center justify-between max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo/Brand - kept for consistency, though not prominent in example image's main screen */}
        <div className="hidden sm:block">
            <Logo className="hidden sm:flex" />
        </div>
         <div className="sm:hidden text-lg font-semibold text-primary">SwasthyaKhoj</div>


        <Button
          variant="ghost"
          className="flex flex-col items-start h-auto p-1 text-left"
          onClick={() => setIsLocationModalOpen(true)}
          title="Change location"
        >
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1 shrink-0" />
            আপনার বর্তমান অবস্থান
          </div>
          {isLoadingLocation && !currentLocationName ? (
            <Skeleton className="h-5 w-32 mt-1 rounded-md" />
          ) : (
            <span className="text-sm font-medium text-foreground truncate max-w-[150px] sm:max-w-[200px] md:max-w-[250px]">
              {currentLocationName || 'Set Location'}
            </span>
          )}
        </Button>
      </div>
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocationName={currentLocationName}
        onSetLocation={onSetLocation}
        onDetectLocation={onDetectLocation}
        isLoadingLocation={isLoadingLocation}
      />
    </header>
  );
}
