import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        setLocation('/chat');
      } else {
        setLocation('/login');
      }
    }
  }, [isAuthenticated, loading, setLocation]);

  return null;
}