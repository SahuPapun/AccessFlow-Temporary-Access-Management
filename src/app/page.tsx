'use client';

import { useAuth } from '@/hooks/use-auth';
import { ShieldCheck } from 'lucide-react';

export default function Home() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            <ShieldCheck className="h-8 w-8 animate-pulse" />
          </div>
          <div className="space-y-2 text-center">
            <p className="text-lg font-medium">Authenticating...</p>
            <p className="text-sm text-muted-foreground">Please wait a moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
