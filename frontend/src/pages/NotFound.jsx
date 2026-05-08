
import Navbar from '../components/Navbar';

export default function NotFound() {
  return (
    <div className="h-screen bg-sky-subtle flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 relative z-10">
        <div className="card-sky p-12 text-center animate-sky-fade">
          <div className="mb-8">
            <h1 className="text-9xl font-bold opacity-50 heading-sky">404</h1>
            <h2 className="text-3xl font-bold text-themed-heading mb-4">Page Not Found</h2>
            <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Sorry, the page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          <a href="/" className="btn-sky-primary px-6 py-3 rounded-2xl inline-block">
            <span>Go Home</span>
          </a>
        </div>
      </div>
    </div>
  );
}
