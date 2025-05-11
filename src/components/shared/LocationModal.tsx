
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
import { MapPin, RefreshCw } from 'lucide-react'; // Added RefreshCw for detect location button

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocationName: string | null;
  onSetLocation: (locationName: string) => void;
  onDetectLocation: () => void; // This should trigger the location detection logic in the hook
}

export function LocationModal({
  isOpen,
  onClose,
  currentLocationName,
  onSetLocation,
  onDetectLocation,
}: LocationModalProps) {
  const [manualLocationInput, setManualLocationInput] = useState('');

  // Update the input field when the modal opens or the currentLocationName prop changes
  useEffect(() => {
    if (isOpen) {
      setManualLocationInput(currentLocationName || '');
    }
  }, [isOpen, currentLocationName]);

  const handleSubmit = () => {
    if (manualLocationInput.trim()) {
      onSetLocation(manualLocationInput.trim());
      onClose();
    }
  };

  const handleDetectLocation = () => {
    onDetectLocation(); // Call the hook's function to detect location
    // The input field will update via useEffect when currentLocationName changes
    // Optionally, close the modal immediately or wait for detection
    // onClose(); // Uncomment if you want modal to close immediately after clicking detect
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" /> Set Your Location
          </DialogTitle>
          <DialogDescription>
            Enter your area or use GPS to find nearby services. Current: {currentLocationName || "Not set"}
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
            />
          </div>
          <Button variant="outline" onClick={handleDetectLocation} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" /> Detect Current Location (GPS)
          </Button>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit} disabled={!manualLocationInput.trim()}>
            Set Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
