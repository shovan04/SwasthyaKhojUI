
"use client";

import Link from 'next/link';
import type { Facility } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Hospital, Store } from 'lucide-react';
import type { MouseEvent } from 'react';

interface EntityCardProps {
  entity: Facility;
}

export function EntityCard({ entity }: EntityCardProps) {
  const Icon = entity.type === 'hospital' ? Hospital : Store;
  const detailLink = entity.type === 'hospital' ? `/hospitals/${entity.id}` : `/medical-stores/${entity.id}`;

  return (
    <Link href={detailLink} passHref legacyBehavior>
      <a className="block h-full"> {/* Outer <a> from Link */}
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full bg-card">
          <CardHeader className="p-4 pb-2 flex-row items-start justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg font-semibold leading-tight flex items-center">
                <Icon className="w-5 h-5 mr-2 text-primary shrink-0" />
                {entity.name}
              </CardTitle>
              {entity.distance && (
                <span className="text-xs text-muted-foreground mt-1">
                  {entity.distance}
                </span>
              )}
            </div>
            <Button
              variant="default"
              size="icon"
              className="ml-auto shrink-0 bg-primary hover:bg-primary/90 w-9 h-9 sm:w-10 sm:h-10"
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation(); // Prevent Link navigation
                e.preventDefault(); // Also prevent default button behavior if any, though Link's navigation is main concern
                window.location.href = `tel:${entity.phone}`; // Initiate call
              }}
              aria-label={`Call ${entity.name}`}
            >
              <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex-grow">
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                <p className="text-xs sm:text-sm">{entity.address}</p>
              </div>
            </div>
          </CardContent>
          {/* Removed explicit View Details and Call Now text buttons from footer */}
        </Card>
      </a>
    </Link>
  );
}

