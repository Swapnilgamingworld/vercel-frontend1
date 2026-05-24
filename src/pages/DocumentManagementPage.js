import { useEffect, useState } from 'react';
import api from '../api/api';

const documentTypes = [
  { key: 'BONAFIDE', label: 'Bonafide' },
  { key: 'TRANSFER_CERTIFICATE', label: 'Transfer Certificate' },
  { key: 'MARKSHEET', label: 'Marksheet' },
];

export default function DocumentManagementPage() {
  const [documents, setDocuments] = useState([]);
  const [form, setForm] = useState({ studentId: '', documentType: 'BONAFIDE', issueDate: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const response = await api.get('/documents');
        setDocuments(response.data || []);
      } catch {
        setError('Unable to load documents.');
      } finally {
        setLoading(false);
      }
    };
    loadDocuments();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const path = `/documents/${form.documentType.toLowerCase().replace('_', '-')}`;
      const response = await api.post(path, form);
      setDocuments((prev) => [response.data, ...prev]);
      setForm({ studentId: '', documentType: 'BONAFIDE', issueDate: '', content: '' });
    } catch {
      setError('Unable to create document.');
    }
  };

  return (
    <div className="page-shell">
      <h1>Document Generation</h1>
      <div className="panel">
        <h2>Generate Document</h2>
        <form onSubmit={handleSubmit} className="grid-form">
          <label>
            Student ID
            <input name="studentId" value={form.studentId} onChange={handleChange} required />
          </label>
          <label>
            Document Type
            <select name="documentType" value={form.documentType} onChange={handleChange}>
              {documentTypes.map((type) => (
                <option key={type.key} value={type.key}>{type.label}</option>
              ))}
            </select>
          </label>
          <label>
            Issue Date
            <input type="date" name="issueDate" value={form.issueDate} onChange={handleChange} required />
          </label>
          <label className="full-width">
            Content
            <textarea name="content" value={form.content} onChange={handleChange} rows="4" required />
          </label>
          <button type="submit">Generate</button>
        </form>
      </div>
      {loading && <div>Loading documents...</div>}
      {error && <div className="form-error">{error}</div>}
      {!loading && !error && (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Type</th>
                <th>Issue Date</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((item) => (
                <tr key={item._id || item.id}>
                  <td>{item.studentId}</td>
                  <td>{item.documentType}</td>
                  <td>{new Date(item.issueDate).toLocaleDateString()}</td>
                  <td>{item.createdBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
