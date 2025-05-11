"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/shared/Logo';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/home');
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="flex flex-col items-center text-center animate-fadeIn">
        <Logo className="mb-6" />
        <p className="text-xl font-medium text-primary-foreground/80">
          স্বাস্থ্য এখন আপনার হাতের মুঠোয়
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Healthcare now at your fingertips
        </p>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
