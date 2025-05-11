import Link from 'next/link';
import Image from 'next/image';
import type { Facility } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Hospital, Store } from 'lucide-react';

interface EntityCardProps {
  entity: Facility;
}

export function EntityCard({ entity }: EntityCardProps) {
  const Icon = entity.type === 'hospital' ? Hospital : Store;
  const detailLink = entity.type === 'hospital' ? `/hospitals/${entity.id}` : `/medical-stores/${entity.id}`;

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold leading-tight flex items-center">
            <Icon className="w-5 h-5 mr-2 text-primary shrink-0" />
            {entity.name}
          </CardTitle>
          {entity.distance && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full whitespace-nowrap">
              {entity.distance}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start">
            <MapPin className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
            <p>{entity.address}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-card-foreground/5 border-t flex flex-col sm:flex-row sm:justify-between gap-2">
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <a href={`tel:${entity.phone}`}>
            <Phone className="mr-2 h-4 w-4" />
            Call Now
          </a>
        </Button>
        <Button asChild className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href={detailLink}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
