import { Link } from 'wouter';
import { useAuth } from '../context/AuthContext';
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpg';

export default function Navbar() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="nav-sky w-full sticky top-0 z-50">
      <div className="container-sky px-2 sm:px-0">
        <nav className="flex flex-wrap items-center justify-between h-16 min-h-[56px]">
          {/* Brand Identity */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="logo-sky">
                <img 
                  src={image1} 
                  alt="SamVad" 
                  className="w-10 h-10 rounded-lg object-cover" 
                />
              </div>
              <span className="heading-sky text-2xl font-bold">
                SamVad
              </span>
            </Link>
          </div>
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-2 sm:space-x-6">
            <Link 
              href="/about" 
              className="nav-link-sky p-2 min-h-[44px] flex items-center justify-center"
              style={{ touchAction: 'manipulation' }}
            >
              About
            </Link>
            
            {/* Authentication Section */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link 
                    href="/settings" 
                    className="flex items-center space-x-1 sm:space-x-2 group p-2 min-h-[44px] min-w-[44px] rounded-lg hover:bg-sky-50 active:bg-sky-100 transition-colors"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <div className="relative">
                      <img 
                        src={image2} 
                        alt="User Avatar" 
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-sky-200 group-hover:border-sky-300 transition-colors" 
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border border-white"></span>
                    </div>
                    <span className="nav-link-sky hidden md:inline text-sm">
                      Account
                    </span>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    href="/login" 
                    className="btn-sky-secondary text-xs sm:text-sm px-3 sm:px-4 py-2 min-h-[44px] flex items-center justify-center"
                    style={{ touchAction: 'manipulation' }}
                  >
                    Log in
                  </Link>
                  <Link 
                    href="/signup" 
                    className="btn-sky-primary text-xs sm:text-sm px-3 sm:px-4 py-2 min-h-[44px] flex items-center justify-center"
                    style={{ touchAction: 'manipulation' }}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
