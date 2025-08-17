import React, { useState } from 'react';
import { Link, useLocation } from 'wouter'; // Added Link import here
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import image2 from '../assets/image2.jpg';

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    try {
      await login(formData.email, formData.password);
      setShowToast(true);
      setTimeout(() => {
        setLocation('/chat');
      }, 1000);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="h-screen bg-sky-subtle flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="card-sky w-full max-w-md p-8 animate-sky-fade">
          {/* Header */}
          <div className="text-center mb-8">
            <img 
              src={image2} 
              alt="SamVad Logo" 
              className="w-16 h-16 mx-auto mb-4 rounded-xl logo-sky" 
            />
            <h2 className="text-sky-deep text-2xl font-bold mb-2">Welcome Back</h2>
            <p className="text-neutral-600">Sign in to continue chatting</p>
          </div>

          {/* Success Toast */}
          {showToast && (
            <div className="status-success mb-4 p-3 rounded-lg text-sm">
              Welcome back! Redirecting to chat...
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="status-error mb-4 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="input-sky"
                required
                data-testid="input-email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="input-sky"
                required
                data-testid="input-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-sky-primary w-full py-3"
              data-testid="button-login"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-6 text-neutral-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-sky-primary font-medium hover:text-sky-primary-dark" data-testid="link-signup">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}