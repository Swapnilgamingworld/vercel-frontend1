import { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const emptyStudent = {
  name: '',
  rollNumber: '',
  department: '',
  year: 1,
  email: '',
  phone: '',
  address: '',
};

export default function StudentManagementPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyStudent);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await api.get('/students');
        setStudents(response.data || []);
      } catch (err) {
        setError('Unable to load students.');
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (student) => {
    setEditingId(student._id || student.id);
    setForm({
      name: student.name || '',
      rollNumber: student.rollNumber || '',
      department: student.department || '',
      year: student.year || 1,
      email: student.email || '',
      phone: student.phone || '',
      address: student.address || '',
    });
    setError('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyStudent);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isAdmin) {
      setError('Only admins can add or update students.');
      return;
    }

    try {
      if (editingId) {
        const response = await api.put(`/students/${editingId}`, form);
        setStudents((prev) => prev.map((student) => (student._id === editingId || student.id === editingId ? response.data : student)));
        setEditingId(null);
      } else {
        const response = await api.post('/students', form);
        setStudents((prev) => [response.data, ...prev]);
      }
      setForm(emptyStudent);
      setError('');
    } catch {
      setError('Unable to save student.');
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm('Delete this student?')) return;
    try {
      await api.delete(`/students/${id}`);
      setStudents((prev) => prev.filter((student) => student._id !== id && student.id !== id));
    } catch {
      setError('Unable to delete student.');
    }
  };

  return (
    <div className="page-shell">
      <h1>Student Management</h1>
      {isAdmin && (
        <div className="panel">
          <h2>{editingId ? 'Edit Student' : 'Add Student'}</h2>
          <form onSubmit={handleSubmit} className="grid-form">
            <label>
              Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Roll Number
              <input name="rollNumber" value={form.rollNumber} onChange={handleChange} required />
            </label>
            <label>
              Department
              <input name="department" value={form.department} onChange={handleChange} required />
            </label>
            <label>
              Year
              <input type="number" name="year" value={form.year} onChange={handleChange} min="1" required />
            </label>
            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={handleChange} />
            </label>
            <label>
              Phone
              <input name="phone" value={form.phone} onChange={handleChange} />
            </label>
            <label>
              Address
              <input name="address" value={form.address} onChange={handleChange} />
            </label>
            <div className="form-actions">
              <button type="submit">{editingId ? 'Save Student' : 'Create Student'}</button>
              {editingId && (
                <button type="button" className="button-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}
      {loading && <div>Loading students...</div>}
      {error && <div className="form-error">{error}</div>}
      {!loading && !error && (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll</th>
                <th>Department</th>
                <th>Year</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id || student.id}>
                  <td>{student.name}</td>
                  <td>{student.rollNumber}</td>
                  <td>{student.department}</td>
                  <td>{student.year}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>
                    {isAdmin && (
                      <>
                        <button type="button" onClick={() => handleEdit(student)}>
                          Edit
                        </button>
                        <button type="button" onClick={() => handleDelete(student._id || student.id)}>
                          Delete
                        </button>
                      </>
                    )}
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
