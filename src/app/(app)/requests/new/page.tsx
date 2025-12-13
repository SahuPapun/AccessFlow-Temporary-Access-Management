import { RequestForm } from "@/components/requests/RequestForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function NewRequestPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">New Access Request</h1>
                <p className="text-muted-foreground">
                    Request temporary access to a resource.
                </p>
            </div>
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Request Details</CardTitle>
                    <CardDescription>
                        Your request will be sent to an approver. Access will be granted automatically upon approval.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RequestForm />
                </CardContent>
            </Card>
        </div>
    );
}
