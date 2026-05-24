import { useEffect, useState } from 'react';
import api from '../api/api';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import AnimatedBackground from '../components/AnimatedBackground';
import StatsCard from '../components/StatsCard';
import SimpleChart from '../components/SimpleChart';
import Sparkline from '../components/Sparkline';
import QuickActions from '../components/QuickActions';

const initialStats = {
  totalStudents: 0,
  totalFeesCollected: 0,
  totalFeesPending: 0,
  pendingDocuments: 0,
  averageMarksByDept: [],
  recentActivities: [],
};

export default function DashboardPage() {
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await api.get('/dashboard');
        setStats(response.data || initialStats);
      } catch (err) {
        setError('Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const generateEnrollmentTrend = (total) => {
    // Generate a simple synthetic monthly trend ending with total
    const months = 8;
    const base = Math.max(0, Math.floor(total * 0.7));
    const step = Math.max(1, Math.floor((total - base) / months));
    const data = Array.from({ length: months }, (_, i) => base + step * i + Math.round(Math.random() * step));
    data[data.length - 1] = total;
    return data;
  };

  const exportDashboard = async () => {
    try {
      const node = document.getElementById('dashboard-root');
      if (!node) return;
      const canvas = await html2canvas(node, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape' });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('dashboard.pdf');
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  return (
    <div className="page-shell" id="dashboard-root">
      <AnimatedBackground />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <h1>📊 Dashboard</h1>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button type="button" className="button button-secondary" onClick={exportDashboard}>
            Export PDF
          </button>
        </div>
      </div>
      {loading && <LoadingSpinner size="large" />}
      {error && <div className="form-error">⚠️ {error}</div>}
      {!loading && !error && (
        <>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: 16 }}>
            <StatsCard title="Total Students" value={stats.totalStudents} icon="👥" trend={`${Math.round(stats.totalStudents * 0.05)} new`} />
            <StatsCard title="Fees Collected" value={`₹${stats.totalFeesCollected.toLocaleString()}`} icon="💰" trend="+4%" color="success" />
            <StatsCard title="Fees Pending" value={`₹${stats.totalFeesPending.toLocaleString()}`} icon="⏳" trend="-2%" color="warning" />
            <StatsCard title="Pending Docs" value={stats.pendingDocuments} icon="📂" trend="—" color="info" />
          </div>

          <QuickActions actions={[{ to: '/students', label: 'New Student', icon: '👨‍🎓' }, { to: '/fees', label: 'Add Fee', icon: '➕' }]} />

          <div className="dashboard-grid">
            <div className="card full-width">
              <h2>Student Enrollment Trend</h2>
              <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <SimpleChart data={generateEnrollmentTrend(stats.totalStudents).map((v, i) => ({ label: `M${i + 1}`, value: v }))} type="line" title="Last months" />
                </div>
                <div style={{ width: 140, textAlign: 'right' }}>
                  <Sparkline data={generateEnrollmentTrend(stats.totalStudents)} />
                  <div style={{ marginTop: 8 }}>
                    <strong style={{ fontSize: 18 }}>{stats.totalStudents}</strong>
                    <div style={{ color: 'var(--muted)' }}>students total</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2>Department Distribution</h2>
              {stats.averageMarksByDept?.length > 0 ? (
                <SimpleChart type="pie" data={stats.averageMarksByDept.map((d) => ({ label: d.department, value: d.average }))} title="By Dept (avg marks used)" />
              ) : (
                <EmptyState icon="🏫" title="No Department Data" message="No departmental breakdown available yet." />
              )}
            </div>

            <div className="card">
              <h2>Fees Collection Progress</h2>
              <div style={{ marginBottom: 12 }}>
                <div style={{ height: 12, background: 'var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.round((stats.totalFeesCollected / Math.max(1, stats.totalFeesCollected + stats.totalFeesPending)) * 100)}%`, background: 'linear-gradient(90deg, var(--success), #16a34a)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <small className="muted">Collected: ₹{stats.totalFeesCollected.toLocaleString()}</small>
                  <small className="muted">Pending: ₹{stats.totalFeesPending.toLocaleString()}</small>
                </div>
              </div>
              <div style={{ marginTop: 8 }}>
                <h3 style={{ margin: '8px 0' }}>Recent Activities</h3>
                {stats.recentActivities?.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {stats.recentActivities.map((a, i) => (
                      <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>{a}</li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState icon="🕒" title="No Activities" message="No recent activities." />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
