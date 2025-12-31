import { Link } from 'wouter';
import { useAuth } from '../context/AuthContext';
import image1 from '../assets/image1.jpg';

export default function Navbar() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="nav-sky w-full sticky top-0 z-50">
      <div className="container-sky px-2 sm:px-0">
        <nav className="flex flex-wrap items-center justify-between h-16 min-h-[56px]">
     
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
          
          <div className="flex items-center space-x-2 sm:space-x-6">
            <Link 
              href="/about" 
              className="nav-link-sky p-2 min-h-[44px] flex items-center justify-center"
              style={{ touchAction: 'manipulation' }}
            >
              About
            </Link>
            
            <div className="flex items-center space-x-1 sm:space-x-3">
              {isAuthenticated ? (
                <Link 
                  href="/chat" 
                  className="btn-sky-primary text-xs sm:text-sm px-3 sm:px-4 py-2 min-h-[44px] flex items-center justify-center"
                  style={{ touchAction: 'manipulation' }}
                >
                  Go to Chat
                </Link>
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
