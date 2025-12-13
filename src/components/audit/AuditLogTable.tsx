'use client';
import { format } from 'date-fns';
import type { AuditLog } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';

const actionColors: Record<string, string> = {
    'request.created': 'bg-blue-500/10 text-blue-500',
    'request.approved': 'bg-status-approved/10 text-status-approved',
    'request.rejected': 'bg-status-rejected/10 text-status-rejected',
    'request.expired': 'bg-slate-500/10 text-slate-500',
    'user.created': 'bg-green-500/10 text-green-500',
}

export function AuditLogTable({ logs, isLoading }: { logs: AuditLog[] | null, isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-48" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  }
  
  if (!logs || logs.length === 0) {
      return <Card><CardContent className="p-6 text-center text-muted-foreground">No audit logs found.</CardContent></Card>
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Actor</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">{log.details?.userEmail || log.userId}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={actionColors[log.action] || ''}>{log.action}</Badge>
              </TableCell>
              <TableCell className="font-mono text-xs">{log.accessRequestId || log.resourceId || log.userId}</TableCell>
              <TableCell>{log.timestamp && format(log.timestamp.toDate(), "MMM d, yyyy 'at' h:mm a")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
