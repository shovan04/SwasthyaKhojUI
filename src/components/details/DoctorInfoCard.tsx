import type { Doctor } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, CalendarDays } from 'lucide-react'; // Using Stethoscope and CalendarDays for better semantics

interface DoctorInfoCardProps {
  doctor: Doctor;
}

export function DoctorInfoCard({ doctor }: DoctorInfoCardProps) {
  return (
    <Card className="mb-4 shadow-sm">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-md font-semibold flex items-center">
          <Stethoscope className="w-5 h-5 mr-2 text-secondary" />
          {doctor.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground ml-7">{doctor.specialization}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="w-4 h-4 mr-2 shrink-0" />
          <span>{doctor.timings}</span>
        </div>
      </CardContent>
    </Card>
  );
}
