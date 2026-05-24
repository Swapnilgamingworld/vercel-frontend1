import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function StudentRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/student/login" replace />;
  }

  if (user.role !== 'STUDENT') {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Access denied. This portal is for students only.</div>;
  }

  return children;
}
