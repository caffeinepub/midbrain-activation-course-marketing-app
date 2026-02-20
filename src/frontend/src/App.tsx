import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import ProfileSetupModal from './components/ProfileSetupModal';
import RoleBasedLayout from './components/RoleBasedLayout';
import { Loader2 } from 'lucide-react';
import { Button } from './components/ui/button';
import { ThemeProvider } from 'next-themes';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

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

  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
          <header className="border-b border-orange-200 bg-white/80 backdrop-blur-sm">
            <div className="container mx-auto flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <img src="/assets/generated/brain-icon.dim_256x256.png" alt="Brain Icon" className="h-10 w-10" />
                <h1 className="text-2xl font-bold text-orange-900">Midbrain Academy</h1>
              </div>
              <Button onClick={login} disabled={isLoggingIn} className="bg-orange-600 hover:bg-orange-700">
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </div>
          </header>

          <main className="flex flex-1 items-center justify-center px-4 py-12">
            <div className="max-w-4xl text-center">
              <img
                src="/assets/generated/hero-banner.dim_1200x400.png"
                alt="Midbrain Activation"
                className="mx-auto mb-8 rounded-2xl shadow-2xl"
              />
              <h2 className="mb-4 text-4xl font-bold text-orange-900 md:text-5xl">
                Unlock Your Mind's Potential
              </h2>
              <p className="mb-8 text-xl text-gray-700">
                Discover the power of midbrain activation through our comprehensive courses designed to enhance
                intuition, creativity, and cognitive abilities.
              </p>
              <Button onClick={login} disabled={isLoggingIn} size="lg" className="bg-orange-600 hover:bg-orange-700">
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Get Started'
                )}
              </Button>
            </div>
          </main>

          <footer className="border-t border-orange-200 bg-white/80 backdrop-blur-sm py-6">
            <div className="container mx-auto px-4 text-center text-sm text-gray-600">
              <p>
                © {new Date().getFullYear()} Midbrain Academy. Built with ❤️ using{' '}
                <a
                  href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                    window.location.hostname
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-700 underline"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </footer>
        </div>
      </ThemeProvider>
    );
  }

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
