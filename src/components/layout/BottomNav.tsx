
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, BriefcaseMedical, UserCircle2 } from 'lucide-react'; // Corrected import for Booking Icon
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/maps', label: 'Maps', icon: Map },
  { href: '/booking', label: 'Booking', icon: BriefcaseMedical },
  { href: '/profile', label: 'Profile', icon: UserCircle2 },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-md z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/home' && pathname === '/'); // Treat / as /home
          return (
            <Link href={item.href} key={item.href} legacyBehavior>
              <a
                className={cn(
                  'flex flex-col items-center justify-center p-2 rounded-md transition-colors w-1/4',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

