import type { ReactNode } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pb-16 md:pb-0"> 
        {/* pb-16 for bottom nav space on mobile */}
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
