import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/HomePage.css';

export default function HomePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'STUDENT') {
        navigate('/student/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="loading-page">Loading...</div>;
  }

  if (user) {
    return null; // Will redirect above
  }

  return (
    <div className="home-page">
      <div className="home-background">
        <div className="gradient-blob blob-1"></div>
        <div className="gradient-blob blob-2"></div>
        <div className="gradient-blob blob-3"></div>
      </div>

      <div className="home-container">
        <div className="home-header">
          <div className="app-logo">🎓</div>
          <h1>College Management System</h1>
          <p>Choose your role to get started</p>
        </div>

        <div className="role-cards">
          {/* Student Portal */}
          <div className="role-card student-card">
            <div className="card-icon">👨‍🎓</div>
            <h2>Student</h2>
            <p>Access your marks, fees, and documents</p>
            <div className="card-features">
              <span>✓ View Marks</span>
              <span>✓ Check Fees</span>
              <span>✓ Manage Documents</span>
            </div>
            <div className="card-actions">
              <a href="/student/login" className="button button-primary">
                Login
              </a>
              <a href="/student/register" className="button button-secondary">
                Register
              </a>
            </div>
          </div>

          {/* Teacher Portal */}
          <div className="role-card teacher-role-card">
            <div className="card-icon">👨‍🏫</div>
            <h2>Teacher</h2>
            <p>Manage classes, grades, and student progress</p>
            <div className="card-features">
              <span>✓ Create Assignments</span>
              <span>✓ Grade Students</span>
              <span>✓ Track Progress</span>
            </div>
            <div className="card-actions">
              <a href="/login" className="button button-primary">
                Login
              </a>
            </div>
          </div>

          {/* Admin Portal */}
          <div className="role-card admin-card">
            <div className="card-icon">🔐</div>
            <h2>Admin</h2>
            <p>Manage users, fees, and overall system</p>
            <div className="card-features">
              <span>✓ Manage Users</span>
              <span>✓ Manage Fees</span>
              <span>✓ System Settings</span>
            </div>
            <div className="card-actions">
              <a href="/login" className="button button-primary">
                Login
              </a>
            </div>
          </div>
        </div>

        <div className="home-footer">
          <p>© 2024 College Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
