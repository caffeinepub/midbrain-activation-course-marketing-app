import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

const MANAGEMENT_PASSWORD = '*#Sindoor@2025';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const [role, setRole] = useState<string>('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate Management password
    if (role === 'Management') {
      if (!password) {
        setPasswordError('Password is required for Management role');
        return;
      }
      if (password !== MANAGEMENT_PASSWORD) {
        setPasswordError('Incorrect password. Please contact administration for the correct password.');
        return;
      }
    }
    
    if (name.trim() && role) {
      saveProfile.mutate({ name: name.trim(), role });
    }
  };

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    setPassword('');
    setPasswordError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  const isFormValid = () => {
    if (!name.trim() || !role) return false;
    if (role === 'Management') {
      return password === MANAGEMENT_PASSWORD;
    }
    return true;
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl text-orange-900">Welcome to Midbrain Academy!</DialogTitle>
          <DialogDescription>Please complete your profile to get started.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={saveProfile.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Select Your Role</Label>
            <Select value={role} onValueChange={handleRoleChange} disabled={saveProfile.isPending}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Choose your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Student">Student</SelectItem>
                <SelectItem value="Management">Management</SelectItem>
                <SelectItem value="Marketer">Marketer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {role === 'Management' && (
            <div className="space-y-2">
              <Label htmlFor="password">Management Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter management password"
                value={password}
                onChange={handlePasswordChange}
                required
                disabled={saveProfile.isPending}
                className={passwordError ? 'border-red-500' : ''}
              />
              {passwordError && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700"
            disabled={!isFormValid() || saveProfile.isPending}
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Complete Setup'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
