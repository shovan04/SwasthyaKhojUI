
"use client";

import { UserCircle2, Settings, LogIn, Mail, Phone as PhoneIcon, Droplets, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  bloodGroup: string;
  dob: string; // Date of Birth
  profileImageUrl?: string;
}

// Mock user data - replace with actual data fetching in a real app
const mockUser: UserProfile = {
  name: 'Aarav Sharma',
  email: 'aarav.sharma@example.com',
  phone: '+91 98765 43210',
  bloodGroup: 'O+',
  dob: '15 Aug 1990',
  // profileImageUrl: 'https://picsum.photos/seed/aarav/100/100', // Optional profile image
};


const DetailRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) => (
  <div className="flex items-center space-x-3 py-2 border-b border-border/50 last:border-b-0">
    <Icon className="h-5 w-5 text-muted-foreground" />
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value || 'Not set'}</p>
    </div>
  </div>
);


export default function ProfilePage() {
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-4rem-4rem)] p-4 md:p-6 space-y-6">
      <div className="flex flex-col items-center text-center">
        <Avatar className="w-24 h-24 mb-4 border-2 border-primary">
          {mockUser.profileImageUrl ? (
            <AvatarImage src={mockUser.profileImageUrl} alt={mockUser.name} data-ai-hint="profile avatar" />
          ) : (
            <AvatarFallback className="text-4xl bg-primary/20 text-primary">
              {mockUser.name.split(' ').map(n => n[0]).join('') || <UserCircle2 size={48} />}
            </AvatarFallback>
          )}
        </Avatar>
        <h1 className="text-2xl font-semibold text-primary-foreground">{mockUser.name}</h1>
        <p className="text-sm text-muted-foreground">{mockUser.email}</p>
      </div>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Personal Information</CardTitle>
          <CardDescription>Your registered details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          <DetailRow icon={Mail} label="Email Address" value={mockUser.email} />
          <DetailRow icon={PhoneIcon} label="Phone Number" value={mockUser.phone} />
          <DetailRow icon={Droplets} label="Blood Group" value={mockUser.bloodGroup} />
          <DetailRow icon={Calendar} label="Date of Birth" value={mockUser.dob} />
        </CardContent>
      </Card>
      
      <div className="space-y-3 w-full max-w-md">
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
