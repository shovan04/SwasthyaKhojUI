import type { ReactNode } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pb-16"> 
        {/* pb-16 for bottom nav space, now applied on all screen sizes */}
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
