import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import Navbar from '../components/Navbar';
import image2 from '../assets/image2.jpg';

export default function Settings() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { openProfile } = useProfile();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
      return;
    }
    
    // Automatically open profile modal on mobile or when directly accessing settings
    openProfile();
  }, [isAuthenticated, setLocation, openProfile]);

  const getInitials = (fullname) => {
    return fullname
      ?.split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-sky-subtle flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-4">
        <div className="card-sky w-full max-w-md p-4 sm:p-8 animate-sky-fade">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold shadow-lg border-4 border-sky-300">
              {user?.profilephoto ? (
                <img 
                  src={user.profilephoto} 
                  alt={user.fullname}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover" 
                />
              ) : (
                <span className="text-2xl sm:text-3xl">{getInitials(user?.fullname)}</span>
              )}
            </div>
            <h2 className="text-sky-deep text-xl sm:text-2xl font-bold mb-2">Account Settings</h2>
            <p className="text-neutral-600">Manage your profile and account</p>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <button
              onClick={openProfile}
              className="w-full btn-sky-primary py-3 text-left px-4 flex items-center justify-between"
            >
              <span>Edit Profile</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <button
              onClick={() => setLocation('/chat')}
              className="w-full btn-sky-secondary py-3 text-left px-4 flex items-center justify-between"
            >
              <span>Back to Chat</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>

          {/* User Info Display */}
          <div className="mt-6 pt-6 border-t border-sky-200">
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-neutral-500">Name:</span>
                <span className="ml-2 font-medium text-neutral-700">{user?.fullname}</span>
              </div>
              <div>
                <span className="text-neutral-500">Email:</span>
                <span className="ml-2 font-medium text-neutral-700">{user?.email}</span>
              </div>
              <div>
                <span className="text-neutral-500">Joined:</span>
                <span className="ml-2 font-medium text-neutral-700">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}