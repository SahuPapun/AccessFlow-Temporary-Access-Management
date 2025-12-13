'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  addDocumentNonBlocking,
  useFirebase,
} from '@/firebase';
import { collection } from 'firebase/firestore';

export function AddResourceForm() {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();
  const { firestore } = useFirebase();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;

    const resourceData = {
      name,
      type,
      description,
    };

    addDocumentNonBlocking(collection(firestore, 'resources'), resourceData);

    toast({
      title: 'Resource Added',
      description: `"${name}" has been added to the resource list.`,
    });

    setName('');
    setType('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Resource Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Production Database"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">Resource Type</Label>
        <Input
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="e.g., Database, Application"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A brief description of the resource."
          required
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit">Add Resource</Button>
      </div>
    </form>
  );
}
