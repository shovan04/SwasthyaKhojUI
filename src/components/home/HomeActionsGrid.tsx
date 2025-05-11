
"use client";

import { useState } from 'react';
import { QuickActionCard } from './QuickActionCard';
import { EmergencyNumbersModal } from './EmergencyNumbersModal'; // Import the new modal
import { Hospital, Store, Users, Siren } from 'lucide-react';

const actions = [
  {
    id: 'hospitals',
    label: 'হাসপাতাল খুঁজুন',
    icon: Hospital,
    href: '/home#hospitals-nearby',
  },
  {
    id: 'medical-stores',
    label: 'মেডিক্যাল স্টোর',
    icon: Store,
    href: '/home#medical-stores-nearby',
  },
  {
    id: 'doctors',
    label: 'ডাক্তার দেখান',
    icon: Users,
    href: '/doctors',
  },
  {
    id: 'emergency',
    label: 'জরুরি সেবা',
    icon: Siren,
    href: '#', // href is now '#' as click will open modal
  },
];

export function HomeActionsGrid() {
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  const handleActionClick = (actionId: string) => {
    if (actionId === 'emergency') {
      setIsEmergencyModalOpen(true);
    }
    // For other actions, the Link component in QuickActionCard will handle navigation
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4">
        {actions.map((action) => (
          <QuickActionCard
            key={action.label}
            icon={action.icon}
            label={action.label}
            href={action.href}
            onClick={action.id === 'emergency' ? () => handleActionClick(action.id) : undefined}
          />
        ))}
      </div>
      <EmergencyNumbersModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </>
  );
}
