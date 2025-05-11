
"use client";

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { MouseEvent } from 'react';

interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  href: string;
  className?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}

export function QuickActionCard({ icon: Icon, label, href, className, onClick }: QuickActionCardProps) {
  const content = (
    <Card className="h-full hover:bg-accent/10 transition-colors">
      <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 space-y-2 h-full text-center">
        <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-1" />
        <p className="text-sm font-medium text-card-foreground">{label}</p>
      </CardContent>
    </Card>
  );

  if (onClick) {
    return (
      <div
        className={`block cursor-pointer ${className}`}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick(e as unknown as MouseEvent<HTMLElement>);
          }
        }}
      >
        {content}
      </div>
    );
  }

  return (
    <Link href={href} passHref legacyBehavior>
      <a className={`block ${className}`}>
        {content}
      </a>
    </Link>
  );
}
