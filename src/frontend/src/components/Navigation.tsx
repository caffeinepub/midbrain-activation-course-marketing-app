import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { LogOut, User } from 'lucide-react';
import type { UserProfile } from '../backend';

interface NavigationProps {
  userProfile: UserProfile;
}

export default function Navigation({ userProfile }: NavigationProps) {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <header className="border-b border-orange-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <img src="/assets/generated/brain-icon.dim_256x256.png" alt="Brain Icon" className="h-10 w-10" />
          <div>
            <h1 className="text-2xl font-bold text-orange-900">Midbrain Academy</h1>
            <p className="text-sm text-gray-600">{userProfile.role} Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-orange-600" />
            <span className="font-medium text-gray-700">{userProfile.name}</span>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm" className="border-orange-300 hover:bg-orange-50">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
