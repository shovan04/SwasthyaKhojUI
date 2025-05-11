import type { MedicalStore, Hospital, Doctor, Facility } from './types';

const commonDoctors: Doctor[] = [
  { id: 'doc1', name: 'Dr. Priya Sharma', specialization: 'General Physician', timings: 'Mon-Fri: 10 AM - 1 PM, 3 PM - 6 PM' },
  { id: 'doc2', name: 'Dr. Rahul Verma', specialization: 'Pediatrician', timings: 'Tue, Thu, Sat: 9 AM - 12 PM' },
  { id: 'doc3', name: 'Dr. Anjali Singh', specialization: 'Dentist', timings: 'Mon, Wed, Fri: 2 PM - 7 PM' },
];

// Example coordinates for Villupuram area
const villupuramCenter = { latitude: 11.9416, longitude: 79.4950 };

export const mockMedicalStores: MedicalStore[] = [
  {
    id: 'ms1',
    name: 'Apollo Pharmacy',
    address: '123 Main Road, Villupuram',
    phone: '+919876543210',
    distance: '1.2 km',
    type: 'medical-store',
    services: ['24/7 Pharmacy', 'Medicine Home Delivery', 'Health Checkups'],
    mapImageUrl: 'https://picsum.photos/seed/ms1/600/400',
    doctors: [commonDoctors[0]],
    coordinates: { latitude: villupuramCenter.latitude + 0.01, longitude: villupuramCenter.longitude - 0.01 }, // Offset for variation
  },
  {
    id: 'ms2',
    name: 'MedPlus Pharmacy',
    address: '45 Market Street, Rural Town',
    phone: '+919123456789',
    distance: '3.5 km',
    type: 'medical-store',
    services: ['Generic Medicines', 'Surgical Supplies'],
    mapImageUrl: 'https://picsum.photos/seed/ms2/600/400',
    coordinates: { latitude: villupuramCenter.latitude - 0.005, longitude: villupuramCenter.longitude + 0.015 },
  },
  {
    id: 'ms3',
    name: 'Sanjeevani Medicals',
    address: '78 Temple Road, Village Name',
    phone: '+918765432109',
    distance: '0.8 km',
    type: 'medical-store',
    services: ['Ayurvedic Medicines', 'Consultation Available'],
    mapImageUrl: 'https://picsum.photos/seed/ms3/600/400',
    doctors: [
      { id: 'doc4', name: 'Vaidya Ram Kishore', specialization: 'Ayurveda', timings: 'Mon-Sat: 9 AM - 1 PM' }
    ],
    coordinates: { latitude: villupuramCenter.latitude + 0.002, longitude: villupuramCenter.longitude + 0.005 },
  },
];

export const mockHospitals: Hospital[] = [
  {
    id: 'h1',
    name: 'Government General Hospital',
    address: 'Hospital Road, District Capital',
    phone: '+917890123456',
    distance: '5.0 km',
    type: 'hospital',
    departments: ['General Medicine', 'Surgery', 'Maternity', 'Emergency'],
    emergencyHotline: '102',
    doctors: [...commonDoctors, { id: 'doc5', name: 'Dr. Suresh Gupta', specialization: 'Cardiologist', timings: 'Mon, Wed: 10 AM - 2 PM' }],
    mapImageUrl: 'https://picsum.photos/seed/h1/600/400',
    coordinates: { latitude: villupuramCenter.latitude - 0.02, longitude: villupuramCenter.longitude - 0.02 },
  },
  {
    id: 'h2',
    name: 'Rural Community Health Centre',
    address: 'Panchayat Office Road, Village Block',
    phone: '+918901234567',
    distance: '2.1 km',
    type: 'hospital',
    departments: ['General OPD', 'Vaccination', 'Basic Lab Tests'],
    doctors: [commonDoctors[0], commonDoctors[1]],
    mapImageUrl: 'https://picsum.photos/seed/h2/600/400',
    coordinates: { latitude: villupuramCenter.latitude + 0.015, longitude: villupuramCenter.longitude + 0.01 },
  },
  {
    id: 'h3',
    name: 'Mother Teresa Clinic',
    address: 'Church Street, Small Town',
    phone: '+919012345678',
    distance: '4.2 km',
    type: 'hospital',
    departments: ['Pediatrics', 'Gynaecology', 'General Health'],
    doctors: [
      commonDoctors[1],
      { id: 'doc6', name: 'Dr. Maria Fernandez', specialization: 'Gynaecologist', timings: 'Tue, Thu: 3 PM - 6 PM' }
    ],
    mapImageUrl: 'https://picsum.photos/seed/h3/600/400',
    coordinates: { latitude: villupuramCenter.latitude - 0.01, longitude: villupuramCenter.longitude + 0.02 },
  },
];

export const allFacilities: Facility[] = [...mockMedicalStores, ...mockHospitals];

export const getFacilityById = (id: string): Facility | undefined => {
  return allFacilities.find(facility => facility.id === id);
};
