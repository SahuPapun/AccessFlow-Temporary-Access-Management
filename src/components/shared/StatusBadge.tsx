import { cn } from '@/lib/utils';
import type { RequestStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

const statusStyles: Record<RequestStatus, string> = {
  pending: 'bg-status-pending/10 text-status-pending border-status-pending/20',
  approved: 'bg-status-approved/10 text-status-approved border-status-approved/20',
  rejected: 'bg-status-rejected/10 text-status-rejected border-status-rejected/20',
  expired: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'capitalize font-medium',
        statusStyles[status]
      )}
    >
      {status}
    </Badge>
  );
}
