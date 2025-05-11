
export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  timings: string; // e.g., "Mon-Fri: 9 AM - 5 PM"
}

interface BaseFacility {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: string; // e.g., "2.5 km"
  coordinates?: LocationCoordinates;
  doctors?: Doctor[];
  mapImageUrl?: string;
  type: 'hospital' | 'medical-store';
}

export interface MedicalStore extends BaseFacility {
  type: 'medical-store';
  services?: string[]; // e.g., "24/7 Pharmacy", "Home Delivery"
}

export interface Hospital extends BaseFacility {
  type: 'hospital';
  departments?: string[]; // e.g., "Cardiology", "Pediatrics"
  emergencyHotline?: string;
}

export type Facility = MedicalStore | Hospital;
