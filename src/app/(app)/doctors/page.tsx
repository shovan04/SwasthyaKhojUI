import { Users } from 'lucide-react';

export default function DoctorsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem-4rem)] p-4 text-center">
      <Users className="w-16 h-16 text-primary mb-4" />
      <h1 className="text-2xl font-semibold mb-2">View Doctors</h1>
      <p className="text-muted-foreground max-w-md">
        This section will allow you to search for and view doctor profiles.
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        (Currently under development)
      </p>
    </div>
  );
}
