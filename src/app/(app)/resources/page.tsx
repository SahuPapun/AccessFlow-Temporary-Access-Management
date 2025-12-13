'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Resource } from '@/lib/types';
import { AddResourceForm } from '@/components/resources/AddResourceForm';
import { useAuth } from '@/hooks/use-auth';

export default function ResourcesPage() {
  const { firestore } = useFirebase();
  const { user } = useAuth();
  const resourcesQuery = useMemoFirebase(
    () => collection(firestore, 'resources'),
    [firestore]
  );
  const { data: resources, isLoading } = useCollection<Resource>(resourcesQuery);

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
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
            <CardDescription>
              A list of all available resources in the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading &&
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-64" />
                      </TableCell>
                    </TableRow>
                  ))}
                {!isLoading &&
                  resources?.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell className="font-medium">{resource.name}</TableCell>
                      <TableCell>{resource.type}</TableCell>
                      <TableCell>{resource.description}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {!isLoading && resources?.length === 0 && (
                <div className="p-6 text-center text-muted-foreground">No resources found.</div>
            )}
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Add New Resource</CardTitle>
            <CardDescription>
              Create a new resource that users can request access to.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddResourceForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
