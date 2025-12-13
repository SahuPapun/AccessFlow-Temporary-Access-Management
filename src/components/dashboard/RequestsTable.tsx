'use client';

import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import type { AccessRequest } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useCollection, useFirebase, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { collection, query, where, limit, doc, serverTimestamp } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';

export function RequestsTable({ showAll = false }: { showAll?: boolean }) {
  const { user } = useAuth();
  const { firestore } = useFirebase();
  const canApprove = user?.role === 'approver' || user?.role === 'admin';

  const requestsQuery = useMemoFirebase(() => {
    if (!user) return null;
    const baseQuery = collection(firestore, 'access_requests');
    if (showAll) {
      if (canApprove) return baseQuery;
      return query(baseQuery, where('requestorId', '==', user.uid));
    }
    if (canApprove) return query(baseQuery, limit(5));
    return query(baseQuery, where('requestorId', '==', user.uid), limit(5));
  }, [firestore, showAll, canApprove, user]);

  const { data: requests, isLoading } = useCollection<AccessRequest>(requestsQuery);

  const handleAction = async (id: string, newStatus: 'approved' | 'rejected') => {
    if (!firestore || !user) return;
    const requestRef = doc(firestore, 'access_requests', id);
    updateDocumentNonBlocking(requestRef, {
      status: newStatus,
      approverId: user.uid,
      approvalDate: serverTimestamp(),
    });
  };

  const ActionsCell = ({ request }: { request: AccessRequest }) => {
    if (!canApprove || request.status !== 'pending') {
      return <div className="h-10" />;
    }

    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="border-status-approved/50 text-status-approved hover:bg-status-approved/10 hover:text-status-approved"
          onClick={() => handleAction(request.id, 'approved')}
        >
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-status-rejected/50 text-status-rejected hover:bg-status-rejected/10 hover:text-status-rejected"
          onClick={() => handleAction(request.id, 'rejected')}
        >
          Reject
        </Button>
      </div>
    );
  };

  if (isLoading) {
    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]">Resource</TableHead>
                        <TableHead>Requested By</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
  }

  if (!requests || requests.length === 0) {
      return <Card><CardContent className="p-6 text-center text-muted-foreground">No requests found.</CardContent></Card>
  }


  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Resource</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Requested</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">{request.resourceName}</TableCell>
              <TableCell>
                <div className="font-medium">{request.requestorName}</div>
                <div className="text-xs text-muted-foreground">{request.requestorEmail}</div>
              </TableCell>
              <TableCell>{request.duration} hours</TableCell>
              <TableCell>
                <StatusBadge status={request.status} />
              </TableCell>
              <TableCell>
                {request.requestDate && formatDistanceToNow(request.requestDate.toDate(), { addSuffix: true })}
              </TableCell>
              <TableCell className="text-right">
                <ActionsCell request={request} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
