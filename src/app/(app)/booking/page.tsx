import { BriefcaseMedical } from 'lucide-react'; // Changed icon

export default function BookingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem-4rem)] p-4 text-center">
      <BriefcaseMedical className="w-16 h-16 text-primary mb-4" />
      <h1 className="text-2xl font-semibold mb-2">Appointment Booking</h1>
      <p className="text-muted-foreground max-w-md">
        The direct booking feature is currently under development.
      </p>
      <p className="text-muted-foreground max-w-md mt-2">
        For now, you can book appointments by calling the medical store or hospital directly using the "Call to Book" or "Call Now" buttons on their respective pages.
      </p>
    </div>
  );
}
