
import Navbar from '../components/Navbar';

export default function NotFound() {
  return (
    <div className="h-screen bg-sky-subtle flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="card-sky p-12 text-center animate-sky-fade">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-sky-primary opacity-50">404</h1>
            <h2 className="text-3xl font-bold text-sky-deep mb-4">Page Not Found</h2>
            <p className="text-neutral-600 text-lg mb-8 max-w-md mx-auto">
              Sorry, the page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          <a href="/" className="btn-sky-primary px-6 py-3 rounded-lg">
            <span>Go Home</span>
          </a>
        </div>
      </div>
    </div>
  );
}
