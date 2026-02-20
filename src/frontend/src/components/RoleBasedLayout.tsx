import type { UserProfile } from '../backend';
import StudentDashboard from '../pages/StudentDashboard';
import ManagementDashboard from '../pages/ManagementDashboard';
import MarketerDashboard from '../pages/MarketerDashboard';
import Navigation from './Navigation';
import { MessageCircle } from 'lucide-react';

interface RoleBasedLayoutProps {
  userProfile: UserProfile;
}

export default function RoleBasedLayout({ userProfile }: RoleBasedLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation userProfile={userProfile} />
      <main className="flex-1">
        {userProfile.role === 'Student' && <StudentDashboard />}
        {userProfile.role === 'Management' && <ManagementDashboard />}
        {userProfile.role === 'Marketer' && <MarketerDashboard />}
      </main>
      <footer className="border-t border-orange-200 bg-white/80 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3 mb-6">
            {/* Management Team */}
            <div className="text-center md:text-left">
              <h3 className="font-semibold text-orange-900 mb-2">Management Team</h3>
              <p className="text-sm text-gray-700">Aruna Mahajan</p>
              <p className="text-sm text-gray-700">Mahesh Gujrati</p>
            </div>

            {/* Contact Us */}
            <div className="text-center">
              <h3 className="font-semibold text-orange-900 mb-2">Contact Us</h3>
              <div className="flex items-center justify-center gap-2">
                <MessageCircle className="h-4 w-4 text-green-600" />
                <a
                  href="https://wa.me/917330202733"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-700 hover:text-green-600 transition-colors"
                >
                  +91 733 020 2733
                </a>
              </div>
              <p className="text-xs text-gray-500 mt-1">WhatsApp</p>
            </div>

            {/* Spacer for alignment */}
            <div></div>
          </div>

          {/* Attribution */}
          <div className="text-center text-sm text-gray-600 border-t border-orange-100 pt-4">
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
        </div>
      </footer>
    </div>
  );
}
