import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetMarketerStats, useUpdateMarketerName } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Loader2, Edit } from 'lucide-react';
import { useState } from 'react';
import { Skeleton } from './ui/skeleton';

export default function MarketerStats() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal();
  const { data: stats, isLoading } = useGetMarketerStats(principal);
  const updateName = useUpdateMarketerName();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');

  const [name] = stats || ['Unknown', BigInt(0)];

  const handleUpdateName = () => {
    if (newName.trim()) {
      updateName.mutate(newName.trim(), {
        onSuccess: () => {
          setIsEditing(false);
          setNewName('');
        },
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-orange-900">Your Profile</CardTitle>
        <CardDescription>Manage your marketer profile information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEditing ? (
          <div className="space-y-2">
            <Label>Marketer Name</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2">
                <p className="font-medium">{name}</p>
              </div>
              <Button onClick={() => setIsEditing(true)} variant="outline" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="newName">Update Name</Label>
            <Input
              id="newName"
              placeholder="Enter new name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={updateName.isPending}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleUpdateName}
                disabled={!newName.trim() || updateName.isPending}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {updateName.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline" disabled={updateName.isPending}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
