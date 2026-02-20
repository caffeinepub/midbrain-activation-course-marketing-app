import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import ProfileSetupModal from './components/ProfileSetupModal';
import RoleBasedLayout from './components/RoleBasedLayout';
import PublicHomepage from './pages/PublicHomepage';
import { Loader2 } from 'lucide-react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  // Show profile setup modal when user is authenticated but has no profile
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (loginStatus === 'initializing') {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="flex h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-orange-600" />
            <p className="mt-4 text-lg text-gray-600">Initializing...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // Show public homepage for unauthenticated users
  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <PublicHomepage />
      </ThemeProvider>
    );
  }

  // Authenticated users flow
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        {showProfileSetup && <ProfileSetupModal />}
        {!showProfileSetup && userProfile && <RoleBasedLayout userProfile={userProfile} />}
        {!showProfileSetup && !userProfile && profileLoading && (
          <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
          </div>
        )}
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
