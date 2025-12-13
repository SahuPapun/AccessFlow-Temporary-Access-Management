import { LoginClientForm } from '@/components/auth/LoginClientForm';
import { ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            AccessFlow
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to manage temporary access requests.
          </p>
        </div>
        <LoginClientForm />
      </div>
    </div>
  );
}
