import { Link } from 'wouter';
import { useAuth } from '../context/AuthContext';
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpg';

export default function Navbar() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="nav-sky w-full sticky top-0 z-50">
      <div className="container-sky">
        <nav className="flex items-center justify-between h-16">
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
          <div className="flex items-center space-x-6">
            <Link 
              href="/about" 
              className="nav-link-sky"
            >
              About
            </Link>
            
            {/* Authentication Section */}
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link 
                    href="/settings" 
                    className="flex items-center space-x-2 group"
                  >
                    <div className="relative">
                      <img 
                        src={image2} 
                        alt="User Avatar" 
                        className="w-8 h-8 rounded-full object-cover border-2 border-sky-200 group-hover:border-sky-300 transition-colors" 
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border border-white"></span>
                    </div>
                    <span className="nav-link-sky hidden md:inline">
                      Account
                    </span>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    href="/login" 
                    className="btn-sky-secondary text-sm px-4 py-2"
                  >
                    Log in
                  </Link>
                  <Link 
                    href="/signup" 
                    className="btn-sky-primary text-sm px-4 py-2"
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
