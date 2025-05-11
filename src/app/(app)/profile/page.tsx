import { UserCircle2, Settings, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem-4rem)] p-4 text-center">
      <UserCircle2 className="w-20 h-20 text-primary mb-6" />
      <h1 className="text-3xl font-semibold mb-3">User Profile</h1>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Manage your account settings, view appointment history, and more. This feature is coming soon!
      </p>
      
      <div className="space-y-3 w-full max-w-xs">
        <Button variant="outline" className="w-full justify-start">
          <Settings className="mr-2 h-5 w-5" /> Account Settings (Coming Soon)
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href="/admin/login">
            <LogIn className="mr-2 h-5 w-5" /> Admin/Staff Login
          </Link>
        </Button>
      </div>
    </div>
  );
}
