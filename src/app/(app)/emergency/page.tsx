import { Siren } from 'lucide-react';

export default function EmergencyPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem-4rem)] p-4 text-center">
      <Siren className="w-16 h-16 text-destructive mb-4" />
      <h1 className="text-2xl font-semibold mb-2">Emergency Services</h1>
      <p className="text-muted-foreground max-w-md">
        This section will provide information about emergency services.
      </p>
       <p className="text-sm text-muted-foreground mt-1">
        (Currently under development)
      </p>
    </div>
  );
}
