export type UserRole = 'user' | 'approver' | 'admin';

export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  photoURL?: string;
  role: UserRole;
}

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export interface AccessRequest {
  id: string;
  resourceId: string;
  resourceName: string;
  requestorId: string;
  requestorEmail: string;
  requestorName: string;
  reason: string;
  duration: number; // in hours
  status: RequestStatus;
  requestDate: any; // Firestore Timestamp
  approvalDate?: any; // Firestore Timestamp
  approverId?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resourceId?: string;
  accessRequestId?: string;
  timestamp: any; // Firestore Timestamp
  details?: Record<string, any>;
}

export interface Resource {
    id: string;
    name: string;
    description: string;
    type: string;
}
