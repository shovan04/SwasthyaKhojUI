
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  // DialogFooter, // Removed
  // DialogClose, // Removed
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, Siren } from 'lucide-react';

interface EmergencyNumbersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const emergencyContactsIndia = [
  { name: "National Emergency Number", number: "112" },
  { name: "Police", number: "100" },
  { name: "Fire", number: "101" },
  { name: "Ambulance", number: "102 / 108" },
  { name: "Disaster Management (NDMA)", number: "1078" },
  { name: "Women Helpline", number: "1091 / 181" },
  { name: "Child Helpline", number: "1098" },
  { name: "Railway Enquiry", number: "139" },
  { name: "Senior Citizen Helpline", number: "14567" },
  { name: "Cyber Crime Helpline", number: "1930" },
];

export function EmergencyNumbersModal({ isOpen, onClose }: EmergencyNumbersModalProps) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground rounded-lg p-4 md:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Siren className="mr-2 h-6 w-6 text-destructive" />
            Important Emergency Numbers (India)
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            In case of an emergency, please dial the relevant number.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {emergencyContactsIndia.map((contact) => (
            <div key={contact.name} className="flex items-center justify-between p-3 bg-background rounded-lg shadow-sm">
              <div>
                <p className="font-medium text-foreground">{contact.name}</p>
                <p className="text-lg font-semibold text-accent">{contact.number}</p>
              </div>
              <Button variant="outline" size="sm" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <a href={`tel:${contact.number.split(' / ')[0].replace(/\s/g, '')}`}>
                  <Phone className="mr-2 h-4 w-4" /> Call
                </a>
              </Button>
            </div>
          ))}
        </div>
        {/* DialogFooter and DialogClose Button removed as per request */}
      </DialogContent>
    </Dialog>
  );
}
