
"use client";

import { useState, useEffect } from 'react';
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
import { MapPin } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocationName: string | null;
  onSetLocation: (locationName: string) => void;
  onDetectLocation: () => void;
}

export function LocationModal({
  isOpen,
  onClose,
  currentLocationName,
  onSetLocation,
  onDetectLocation,
}: LocationModalProps) {
  const [manualLocation, setManualLocation] = useState(currentLocationName || '');

  const handleSubmit = () => {
    if (manualLocation.trim()) {
      onSetLocation(manualLocation.trim());
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setManualLocation(currentLocationName || '');
    }
  }, [isOpen, currentLocationName]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" /> Set Your Location
          </DialogTitle>
          <DialogDescription>
            Enter your area or use GPS to find nearby services.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right col-span-1">
              Area
            </Label>
            <Input
              id="location"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              placeholder="e.g., Villupuram, Anna Nagar"
              className="col-span-3"
            />
          </div>
          <Button variant="outline" onClick={() => { onDetectLocation(); onClose(); }} className="w-full">
            <MapPin className="mr-2 h-4 w-4" /> Use Current Location (GPS)
          </Button>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>
            Set Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
