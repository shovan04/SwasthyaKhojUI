
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { MapPin, RefreshCw, Loader2 } from 'lucide-react'; 

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocationName: string | null;
  onSetLocation: (locationName: string) => void;
  onDetectLocation: () => Promise<string | void>; 
  isLoadingLocation: boolean;
}

export function LocationModal({
  isOpen,
  onClose,
  currentLocationName,
  onSetLocation,
  onDetectLocation,
  isLoadingLocation,
}: LocationModalProps) {
  const [manualLocationInput, setManualLocationInput] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (!isDetecting) {
        setManualLocationInput(currentLocationName || '');
      }
    } else {
      setIsDetecting(false);
    }
  }, [isOpen, currentLocationName, isDetecting]);

  const handleSubmit = () => {
    if (manualLocationInput.trim()) {
      onSetLocation(manualLocationInput.trim());
      onClose();
    }
  };

  const handleDetectLocation = useCallback(async () => {
    setIsDetecting(true);
    setManualLocationInput('Detecting...'); 
    try {
      const detectedName = await onDetectLocation();
      if (detectedName) {
        setManualLocationInput(detectedName); 
      }
    } catch (error) {
      console.error("Error in modal detect location:", error);
      setManualLocationInput(currentLocationName || "Detection failed"); 
    } finally {
      setIsDetecting(false);
    }
  }, [onDetectLocation, currentLocationName]);


  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" /> Set Your Location
          </DialogTitle>
          <DialogDescription>
            Enter your area or use GPS. Current: {isLoadingLocation && !currentLocationName ? "Loading..." : (currentLocationName || "Not set")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right col-span-1">
              Area
            </Label>
            <Input
              id="location"
              value={manualLocationInput}
              onChange={(e) => setManualLocationInput(e.target.value)}
              placeholder="e.g., Villupuram, Anna Nagar"
              className="col-span-3"
              disabled={isDetecting}
            />
          </div>
          <Button variant="outline" onClick={handleDetectLocation} className="w-full" disabled={isDetecting || isLoadingLocation}>
            {isDetecting || (isLoadingLocation && !currentLocationName && manualLocationInput === 'Detecting...') ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            {isDetecting || (isLoadingLocation && !currentLocationName && manualLocationInput === 'Detecting...') ? 'Detecting...' : 'Detect Current Location (GPS)'}
          </Button>
        </div>
        <DialogFooter className="space-y-2 sm:space-y-0">
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit} disabled={!manualLocationInput.trim() || isDetecting || manualLocationInput === 'Detecting...'}>
            Set Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
