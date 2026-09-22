import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// UX guard only — the real security is the role check on the backend
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;

  return children;
}
