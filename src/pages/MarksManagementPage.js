import { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const emptyMark = {
  studentId: '',
  subject: '',
  marksObtained: '',
  maxMarks: '',
  semester: '',
};

export default function MarksManagementPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [marks, setMarks] = useState([]);
  const [form, setForm] = useState(emptyMark);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMarks = async () => {
      try {
        const response = await api.get('/marks');
        setMarks(response.data || []);
      } catch {
        setError('Unable to load marks.');
      } finally {
        setLoading(false);
      }
    };
    loadMarks();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (mark) => {
    setEditingId(mark._id || mark.id);
    setForm({
      studentId: mark.studentId || '',
      subject: mark.subject || '',
      marksObtained: mark.marksObtained?.toString() || '',
      maxMarks: mark.maxMarks?.toString() || '',
      semester: mark.semester?.toString() || '',
    });
    setError('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyMark);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        studentId: form.studentId,
        subject: form.subject,
        marksObtained: Number(form.marksObtained),
        maxMarks: Number(form.maxMarks),
        semester: Number(form.semester),
      };

      if (editingId) {
        const response = await api.put(`/marks/${editingId}`, payload);
        setMarks((prev) => prev.map((mark) => (mark._id === editingId || mark.id === editingId ? response.data : mark)));
      } else {
        const response = await api.post('/marks', payload);
        setMarks((prev) => [response.data, ...prev]);
      }

      setForm(emptyMark);
      setEditingId(null);
      setError('');
    } catch {
      setError('Unable to save marks.');
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm('Delete this marks entry?')) return;
    try {
      await api.delete(`/marks/${id}`);
      setMarks((prev) => prev.filter((mark) => mark._id !== id && mark.id !== id));
    } catch {
      setError('Unable to delete marks.');
    }
  };

  return (
    <div className="page-shell">
      <h1>Marks Management</h1>
      <div className="panel">
        <h2>{editingId ? 'Update Mark Entry' : 'Add Mark Entry'}</h2>
        <form onSubmit={handleSubmit} className="grid-form">
          <label>
            Student ID
            <input name="studentId" value={form.studentId} onChange={handleChange} required />
          </label>
          <label>
            Subject
            <input name="subject" value={form.subject} onChange={handleChange} required />
          </label>
          <label>
            Marks Obtained
            <input type="number" name="marksObtained" value={form.marksObtained} onChange={handleChange} required />
          </label>
          <label>
            Max Marks
            <input type="number" name="maxMarks" value={form.maxMarks} onChange={handleChange} required />
          </label>
          <label>
            Semester
            <input type="number" name="semester" value={form.semester} onChange={handleChange} required />
          </label>
          <div className="form-actions">
            <button type="submit">{editingId ? 'Save Marks' : 'Save Marks'}</button>
            {editingId && (
              <button type="button" className="button-secondary" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      {loading && <div>Loading marks...</div>}
      {error && <div className="form-error">{error}</div>}
      {!loading && !error && (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Subject</th>
                <th>Marks</th>
                <th>Max Marks</th>
                <th>Semester</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((item) => (
                <tr key={item._id || `${item.studentId}-${item.subject}-${item.semester}`}>
                  <td>{item.studentId}</td>
                  <td>{item.subject}</td>
                  <td>{item.marksObtained}</td>
                  <td>{item.maxMarks}</td>
                  <td>{item.semester}</td>
                  <td>
                    <button type="button" onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                    {isAdmin && (
                      <button type="button" onClick={() => handleDelete(item._id || item.id)}>
                        Delete
                      </button>
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
