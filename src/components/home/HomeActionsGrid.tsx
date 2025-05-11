"use client";

import { QuickActionCard } from './QuickActionCard';
import { Hospital, Store, Users, Siren } from 'lucide-react';

const actions = [
  {
    label: 'হাসপাতাল খুঁজুন',
    icon: Hospital,
    href: '/home#hospitals-nearby', // Placeholder, could link to a filtered view or scroll
  },
  {
    label: 'মেডিক্যাল স্টোর',
    icon: Store,
    href: '/home#medical-stores-nearby', // Placeholder
  },
  {
    label: 'ডাক্তার দেখান',
    icon: Users,
    href: '/doctors', // Placeholder for a future doctors page
  },
  {
    label: 'জরুরি সেবা',
    icon: Siren, // Using Siren for emergency
    href: '/emergency', // Placeholder for a future emergency page
  },
];

export function HomeActionsGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4">
      {actions.map((action) => (
        <QuickActionCard
          key={action.label}
          icon={action.icon}
          label={action.label}
          href={action.href}
        />
      ))}
    </div>
  );
}
