import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TeacherRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Access denied. This portal is for teachers only.</div>;
  }

  return children;
}
