import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

interface MapPreviewProps {
  imageUrl?: string;
  altText?: string;
}

export function MapPreview({ imageUrl, altText = "Map Preview" }: MapPreviewProps) {
  const effectiveImageUrl = imageUrl || `https://picsum.photos/seed/${altText.replace(/\s+/g, '')}/600/300`;
  
  return (
    <Card className="overflow-hidden my-4">
      <CardContent className="p-0">
        <div className="aspect-video relative w-full">
          <Image
            src={effectiveImageUrl}
            alt={altText}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
            data-ai-hint="map location"
          />
        </div>
      </CardContent>
    </Card>
  );
}
