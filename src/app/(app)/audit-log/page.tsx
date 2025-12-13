'use client';
import { AuditLogTable } from "@/components/audit/AuditLogTable";
import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { AuditLog } from "@/lib/types";

export default function AuditLogPage() {
    const { firestore } = useFirebase();

    const logsQuery = useMemoFirebase(() => collection(firestore, 'audit_logs'), [firestore]);
    const { data: logs, isLoading } = useCollection<AuditLog>(logsQuery);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Audit Log</h1>
                <p className="text-muted-foreground">
                    A log of all actions taken within the system.
                </p>
            </div>
            <AuditLogTable logs={logs} isLoading={isLoading} />
        </div>
    );
}
