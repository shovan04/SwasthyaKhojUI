"use client";

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  href: string;
  className?: string;
}

export function QuickActionCard({ icon: Icon, label, href, className }: QuickActionCardProps) {
  return (
    <Link href={href} passHref legacyBehavior>
      <a className={`block ${className}`}>
        <Card className="h-full hover:bg-accent/10 transition-colors">
          <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 space-y-2 h-full text-center">
            <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-1" />
            <p className="text-sm font-medium text-card-foreground">{label}</p>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}
