import { useAuth } from '../context/AuthContext';
import { Route } from "wouter";

export default function ProtectedRoute({ component: Component, ...rest }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // or a loading spinner

  if (!isAuthenticated) {
    window.location.replace('/login');
    return null;
  }

  return <Route {...rest} component={Component} />;
}
