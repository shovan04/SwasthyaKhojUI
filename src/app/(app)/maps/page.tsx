import { Map } from 'lucide-react';

export default function MapsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem-4rem)] p-4 text-center"> {/* Adjust min-h for header/footer */}
      <Map className="w-16 h-16 text-primary mb-4" />
      <h1 className="text-2xl font-semibold mb-2">Maps Feature</h1>
      <p className="text-muted-foreground">
        This section will display interactive maps to help you find facilities.
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        (Currently under development)
      </p>
    </div>
  );
}
