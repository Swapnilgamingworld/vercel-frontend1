import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function UserManagementPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data || []);
      } catch (err) {
        setError('Unable to load users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) {
      return;
    }
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id && user.id !== id));
    } catch {
      setError('Failed to delete user.');
    }
  };

  return (
    <div className="page-shell">
      <h1>User Management</h1>
      <button type="button" onClick={() => navigate('/register')} style={{ marginBottom: '1rem' }}>
        Create New User
      </button>
      {loading && <div>Loading users...</div>}
      {error && <div className="form-error">{error}</div>}
      {!loading && !error && (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id || user.id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleString()}</td>
                  <td>
                    <button type="button" onClick={() => handleDelete(user._id || user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
