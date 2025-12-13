
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { UsersTable } from '@/components/users/UsersTable';

export default function UsersPage() {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-semibold tracking-tight">Access Denied</h1>
            <p className="text-muted-foreground">
                You do not have permission to view this page.
            </p>
        </div>
    )
  }

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-2xl font-semibold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">
                View and manage user roles across the application.
            </p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>A list of all users in the system.</CardDescription>
            </CardHeader>
            <CardContent>
                <UsersTable />
            </CardContent>
        </Card>
    </div>
  );
}
