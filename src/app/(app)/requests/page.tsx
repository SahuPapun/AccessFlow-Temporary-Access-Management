import { RequestsTable } from '@/components/dashboard/RequestsTable';

export default function RequestsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Access Requests</h1>
        <p className="text-muted-foreground">
          View and manage all access requests across the organization.
        </p>
      </div>
      <RequestsTable showAll={true} />
    </div>
  );
}
