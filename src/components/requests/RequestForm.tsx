'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '../ui/slider';
import { addDocumentNonBlocking, useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Resource } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function RequestForm() {
  const [resourceId, setResourceId] = useState('');
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: isAuthLoading } = useAuth();
  const { firestore } = useFirebase();

  const resourcesQuery = useMemoFirebase(() => collection(firestore, 'resources'), [firestore]);
  const { data: resources, isLoading: isLoadingResources } = useCollection<Resource>(resourcesQuery);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to submit a request.',
      });
      return;
    }

    setIsSubmitting(true);
    
    const selectedResource = resources?.find(r => r.id === resourceId);

    const accessRequest = {
      resourceId: resourceId,
      resourceName: selectedResource?.name || 'Unknown Resource',
      requestorId: user.uid,
      requestorEmail: user.email,
      requestorName: `${user.firstName} ${user.lastName}`,
      reason,
      duration,
      status: 'pending',
      requestDate: serverTimestamp(),
    };

    try {
      await addDocumentNonBlocking(collection(firestore, 'access_requests'), accessRequest);

      toast({
          title: "Request Submitted",
          description: `Your request for "${selectedResource?.name}" has been submitted for approval.`,
      });
      
      router.push('/requests');
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Submission Failed",
            description: "There was an error submitting your request. Please try again."
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const isButtonDisabled = isSubmitting || isAuthLoading || !resourceId;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="resourceId">Resource</Label>
        {isLoadingResources ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select value={resourceId} onValueChange={setResourceId} disabled={isSubmitting}>
            <SelectTrigger id="resourceId">
              <SelectValue placeholder="Select a resource..." />
            </SelectTrigger>
            <SelectContent>
              {resources?.map((resource) => (
                <SelectItem key={resource.id} value={resource.id}>
                  {resource.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Access</Label>
        <Textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g., Investigating a production issue."
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="duration">Duration (hours)</Label>
        <div className="flex items-center gap-4">
            <Slider
                id="duration"
                min={1}
                max={24}
                step={1}
                value={[duration]}
                onValueChange={(value) => setDuration(value[0])}
                disabled={isSubmitting}
            />
            <span className="font-semibold text-lg w-12 text-center">{duration}h</span>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" disabled={isButtonDisabled}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Submit Request
        </Button>
      </div>
    </form>
  );
}
