
'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollection, useFirebase, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import type { User, UserRole } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAuth } from '@/hooks/use-auth';

export function UsersTable() {
  const { firestore } = useFirebase();
  const { user: currentUser } = useAuth();
  const usersQuery = useMemoFirebase(() => collection(firestore, 'users'), [firestore]);
  const { data: users, isLoading } = useCollection<User>(usersQuery);

  const handleRoleChange = (uid: string, newRole: UserRole) => {
    if (!firestore) return;
    const userDocRef = doc(firestore, 'users', uid);
    updateDocumentNonBlocking(userDocRef, { role: newRole });
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase();
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[350px]'>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className='w-[200px]'>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading &&
          [...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className='flex items-center gap-3'>
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className='space-y-1'>
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-48" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-10 w-full" />
              </TableCell>
            </TableRow>
          ))}
        {!isLoading &&
          users?.map((user) => (
            <TableRow key={user.uid}>
              <TableCell>
                <div className='flex items-center gap-3'>
                    <Avatar>
                        {user.photoURL && <AvatarImage src={user.photoURL} alt={`${user.firstName} ${user.lastName}`} />}
                        <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                    </Avatar>
                    <div className='font-medium'>{user.firstName} {user.lastName}</div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{user.email}</TableCell>
              <TableCell>
                <Select
                  value={user.role}
                  onValueChange={(newRole) => handleRoleChange(user.uid, newRole as UserRole)}
                  disabled={user.uid === currentUser?.uid}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="approver">Approver</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
