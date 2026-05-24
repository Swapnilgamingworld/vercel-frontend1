import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="brand">College Management</div>
        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/students">Students</NavLink>
          <NavLink to="/documents">Documents</NavLink>
          <NavLink to="/marks">Marks</NavLink>
          <NavLink to="/fees">Fees</NavLink>
          {user?.role === 'ADMIN' && <NavLink to="/users">Users</NavLink>}
        </nav>
        <div className="sidebar-footer">
          <span>{user?.email}</span>
          <button type="button" onClick={handleLogout}>Logout</button>
        </div>
      </aside>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
