import { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const emptyFee = {
  studentId: '',
  totalAmount: '',
  paidAmount: '',
  paymentStatus: 'DUE',
  amount: '',
  date: '',
};

export default function FeeManagementPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [fees, setFees] = useState([]);
  const [form, setForm] = useState(emptyFee);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFees = async () => {
      try {
        const response = await api.get('/fees');
        setFees(response.data || []);
      } catch {
        setError('Unable to load fee records.');
      } finally {
        setLoading(false);
      }
    };
    loadFees();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (fee) => {
    setEditingId(fee._id || fee.id);
    setForm({
      studentId: fee.studentId || '',
      totalAmount: fee.totalAmount?.toString() || '',
      paidAmount: fee.paidAmount?.toString() || '',
      paymentStatus: fee.paymentStatus || 'DUE',
      amount: '',
      date: '',
    });
    setError('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyFee);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isAdmin && !editingId) {
      setError('Only admins can add fee records.');
      return;
    }

    const totalAmount = Number(form.totalAmount);
    const paidAmount = Number(form.paidAmount);
    const dueAmount = totalAmount - paidAmount;
    const payload = {
      studentId: form.studentId,
      totalAmount,
      paidAmount,
      dueAmount,
      paymentStatus: form.paymentStatus,
    };

    if (form.amount && form.date) {
      payload.paymentDates = [{ amount: Number(form.amount), date: form.date }];
    }

    try {
      if (editingId) {
        const response = await api.put(`/fees/${editingId}`, payload);
        setFees((prev) => prev.map((fee) => (fee._id === editingId || fee.id === editingId ? response.data : fee)));
      } else {
        const response = await api.post('/fees', payload);
        setFees((prev) => [response.data, ...prev]);
      }
      setForm(emptyFee);
      setEditingId(null);
      setError('');
    } catch {
      setError('Unable to save fee record.');
    }
  };

  const canEdit = isAdmin || Boolean(editingId);

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm('Delete this fee record?')) return;
    try {
      await api.delete(`/fees/${id}`);
      setFees((prev) => prev.filter((fee) => fee._id !== id && fee.id !== id));
    } catch {
      setError('Unable to delete fee record.');
    }
  };

  return (
    <div className="page-shell">
      <h1>Fee Management</h1>
      <div className="panel">
        <h2>{editingId ? 'Update Fee Record' : isAdmin ? 'Add Fee Record' : 'Update Fee Payment'}</h2>
        {!isAdmin && !editingId && (
          <div className="panel-message">
            Teachers can update existing fee records by choosing Edit from the table below.
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid-form">
          <label>
            Student ID
            <input
              name="studentId"
              value={form.studentId}
              onChange={handleChange}
              required
              disabled={!canEdit}
            />
          </label>
          <label>
            Total Amount
            <input
              type="number"
              name="totalAmount"
              value={form.totalAmount}
              onChange={handleChange}
              required
              disabled={!isAdmin && !editingId}
            />
          </label>
          <label>
            Paid Amount
            <input type="number" name="paidAmount" value={form.paidAmount} onChange={handleChange} required disabled={!canEdit} />
          </label>
          <label>
            Status
            <select name="paymentStatus" value={form.paymentStatus} onChange={handleChange} disabled={!canEdit}>
              <option value="PAID">PAID</option>
              <option value="PARTIAL">PARTIAL</option>
              <option value="DUE">DUE</option>
            </select>
          </label>
          <label>
            Payment Amount
            <input type="number" name="amount" value={form.amount} onChange={handleChange} disabled={!canEdit} />
          </label>
          <label>
            Payment Date
            <input type="date" name="date" value={form.date} onChange={handleChange} disabled={!canEdit} />
          </label>
          <div className="form-actions">
            <button type="submit" disabled={!canEdit}>
              {editingId ? 'Save Fee' : 'Save Fee'}
            </button>
            {editingId && (
              <button type="button" className="button-secondary" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      {loading && <div>Loading fee records...</div>}
      {error && <div className="form-error">{error}</div>}
      {!loading && !error && (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee) => (
                <tr key={fee._id || fee.id}>
                  <td>{fee.studentId}</td>
                  <td>{fee.totalAmount}</td>
                  <td>{fee.paidAmount}</td>
                  <td>{fee.dueAmount}</td>
                  <td>{fee.paymentStatus}</td>
                  <td>
                    <button type="button" onClick={() => handleEdit(fee)}>
                      Edit
                    </button>
                    {isAdmin && (
                      <button type="button" onClick={() => handleDelete(fee._id || fee.id)}>
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
