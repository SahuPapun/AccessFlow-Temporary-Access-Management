'use client';
import { StatCard } from '@/components/dashboard/StatCard';
import { RequestsTable } from '@/components/dashboard/RequestsTable';
import { CheckCircle2, Clock, ShieldAlert, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { AccessRequest } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';

export default function DashboardPage() {
  const { firestore } = useFirebase();
  const { user } = useAuth();
  
  const canApprove = user?.role === 'approver' || user?.role === 'admin';

  const requestsQuery = useMemoFirebase(() => {
    if (!user) return null;
    if (canApprove) return collection(firestore, 'access_requests');
    return query(collection(firestore, 'access_requests'), where('requestorId', '==', user.uid));
  }, [firestore, canApprove, user]);

  const { data: requests, isLoading } = useCollection<AccessRequest>(requestsQuery);

  const stats = {
    approved: requests?.filter((r) => r.status === 'approved').length || 0,
    pending: requests?.filter((r) => r.status === 'pending').length || 0,
    rejected: requests?.filter((r) => r.status === 'rejected').length || 0,
    expired: requests?.filter((r) => r.status === 'expired').length || 0,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          An overview of access requests and system status.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Access"
          value={isLoading ? '...' : stats.approved}
          icon={CheckCircle2}
          color="text-status-approved"
        />
        <StatCard
          title="Pending Requests"
          value={isLoading ? '...' : stats.pending}
          icon={Clock}
          color="text-status-pending"
        />
        <StatCard
          title="Expiring Soon"
          value={isLoading ? '...' : stats.expired}
          icon={ShieldAlert}
          color="text-status-expired"
        />
        <StatCard
          title="Rejected Requests"
          value={isLoading ? '...' : stats.rejected}
          icon={XCircle}
          color="text-status-rejected"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Recent Requests</h2>
            <Button variant="ghost" asChild>
                <Link href="/requests">View all</Link>
            </Button>
        </div>
        <RequestsTable />
      </div>
    </div>
  );
}
