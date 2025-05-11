
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, BriefcaseMedical, UserCircle2 } from 'lucide-react'; // Used Compass for "অনুসন্ধান"
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/home', label: 'হোম', icon: Home }, // Home
  { href: '/maps', label: 'অনুসন্ধান', icon: Compass }, // Search/Discover (Maps page)
  { href: '/booking', label: 'বুকিং', icon: BriefcaseMedical }, // Booking
  { href: '/profile', label: 'প্রোফাইল', icon: UserCircle2 }, // Profile
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-md z-50">
      <div className="flex justify-around items-center h-16 max-w-5xl mx-auto">
        {navItems.map((item) => {
          let isActive = pathname === item.href || (item.href === '/home' && pathname === '/');
          
          if (item.href === '/maps') {
            isActive = isActive || pathname.startsWith('/hospitals/') || pathname.startsWith('/medical-stores/');
          }

          return (
            <Link href={item.href} key={item.href} legacyBehavior>
              <a
                className={cn(
                  'flex flex-col items-center justify-center p-2 rounded-md transition-colors w-1/4', // Ensure equal width
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className="w-6 h-6 mb-0.5" />
                <span className="text-xs font-medium">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

