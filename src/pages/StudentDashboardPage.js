import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import StatsCard from '../components/StatsCard';
import AnimatedBackground from '../components/AnimatedBackground';
import '../styles/StudentDashboard.css';

export default function StudentDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({
    marks: [],
    fees: {},
    documents: [],
    studentInfo: null,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadData = async () => {
      try {
        setData({
          marks: [
            { subject: 'Mathematics', obtained: 85, total: 100, percentage: 85 },
            { subject: 'Physics', obtained: 78, total: 100, percentage: 78 },
            { subject: 'Chemistry', obtained: 92, total: 100, percentage: 92 },
            { subject: 'English', obtained: 88, total: 100, percentage: 88 },
          ],
          fees: {
            totalAmount: 50000,
            paidAmount: 35000,
            dueAmount: 15000,
            pendingPercent: 30,
          },
          documents: [
            { name: 'Admission Letter', status: 'Submitted', uploadedAt: '2024-01-15' },
            { name: 'Character Certificate', status: 'Pending', uploadedAt: null },
            { name: 'ID Proof', status: 'Submitted', uploadedAt: '2024-01-10' },
          ],
          studentInfo: {
            name: user?.fullName || user?.email || 'Student',
            rollNumber: user?.rollNumber || 'N/A',
            department: 'Computer Science',
            year: 3,
            email: user?.email,
            semester: 'VI',
          },
        });
      } catch (err) {
        console.error('Failed to load student data', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/student/login');
  };

  if (loading) return <LoadingSpinner size="large" />;

  const avgMarks = Math.round(
    data.marks.reduce((sum, m) => sum + m.percentage, 0) / (data.marks.length || 1)
  );

  return (
    <div className="student-dashboard-container">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Student Navbar */}
      <nav className="student-navbar">
        <div className="student-nav-brand">
          <div className="student-brand-icon">🎓</div>
          <h2>My College Portal</h2>
        </div>
        <div className="student-nav-user">
          <span className="student-user-name">{data.studentInfo?.name}</span>
          <button className="student-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="student-main-content">
        {/* Left Sidebar */}
        <aside className="student-sidebar">
          <div className="student-card-profile">
            <div className="profile-avatar">👨‍🎓</div>
            <h3>{data.studentInfo?.name}</h3>
            <p>{data.studentInfo?.rollNumber}</p>
            <div className="profile-meta">
              <div className="meta-item">
                <span className="meta-label">Department</span>
                <span className="meta-value">{data.studentInfo?.department}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Year</span>
                <span className="meta-value">Year {data.studentInfo?.year}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Semester</span>
                <span className="meta-value">{data.studentInfo?.semester}</span>
              </div>
            </div>
          </div>

          <div className="student-sidebar-menu">
            <button
              className={`student-menu-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
            <button
              className={`student-menu-item ${activeTab === 'marks' ? 'active' : ''}`}
              onClick={() => setActiveTab('marks')}
            >
              📈 Marks
            </button>
            <button
              className={`student-menu-item ${activeTab === 'fees' ? 'active' : ''}`}
              onClick={() => setActiveTab('fees')}
            >
              💳 Fees
            </button>
            <button
              className={`student-menu-item ${activeTab === 'documents' ? 'active' : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              📂 Documents
            </button>
            <button
              className={`student-menu-item ${activeTab === 'help' ? 'active' : ''}`}
              onClick={() => setActiveTab('help')}
            >
              🆘 Help
            </button>
          </div>
        </aside>

        {/* Right Content Area */}
        <div className="student-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="student-overview">
              <div className="overview-header">
                <h1>Welcome back, {data.studentInfo?.name}! 👋</h1>
                <p>Here's your academic progress at a glance</p>
              </div>

              <div className="overview-stats">
                <StatsCard
                  icon="📊"
                  title="Average Marks"
                  value={`${avgMarks}%`}
                  trend="↑"
                  color="primary"
                />
                <StatsCard
                  icon="💰"
                  title="Fees Paid"
                  value={`₹${(data.fees.paidAmount / 1000).toFixed(1)}K`}
                  trend="→"
                  color="success"
                />
                <StatsCard
                  icon="✅"
                  title="Docs Submitted"
                  value={`${data.documents.filter((d) => d.status === 'Submitted').length}/${data.documents.length}`}
                  trend="→"
                  color="info"
                />
                <StatsCard
                  icon="⏰"
                  title="Fee Status"
                  value={`${Math.round((data.fees.paidAmount / data.fees.totalAmount) * 100)}%`}
                  trend={data.fees.dueAmount > 0 ? '↓' : '↑'}
                  color="warning"
                />
              </div>

              <div className="overview-grid">
                <div className="overview-card">
                  <h3>📚 Latest Marks</h3>
                  <div className="marks-mini-list">
                    {data.marks.slice(0, 3).map((mark, idx) => (
                      <div key={idx} className="mark-item">
                        <span>{mark.subject}</span>
                        <span className="mark-badge">{mark.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="overview-card">
                  <h3>📧 Quick Links</h3>
                  <div className="quick-links">
                    <button type="button" className="quick-link">📞 Contact Counselor</button>
                    <button type="button" className="quick-link">📅 View Timetable</button>
                    <button type="button" className="quick-link">📝 Submit Assignment</button>
                    <button type="button" className="quick-link">⚙️ Settings</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Marks Tab */}
          {activeTab === 'marks' && (
            <div className="student-marks">
              <h1>📈 Your Academic Performance</h1>
              <div className="marks-table-container">
                <table className="marks-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Obtained</th>
                      <th>Total</th>
                      <th>Grade</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.marks.map((mark, idx) => (
                      <tr key={idx}>
                        <td>{mark.subject}</td>
                        <td className="mark-value">{mark.obtained}</td>
                        <td>{mark.total}</td>
                        <td>
                          <span className="grade-badge">
                            {mark.percentage >= 85 ? 'A' : mark.percentage >= 70 ? 'B' : 'C'}
                          </span>
                        </td>
                        <td>
                          <span className="status-badge status-pass">Pass</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Fees Tab */}
          {activeTab === 'fees' && (
            <div className="student-fees">
              <h1>💳 Fee Payment Status</h1>
              <div className="fees-detail-card">
                <div className="fee-summary">
                  <div className="fee-box">
                    <span className="fee-label">Total Fees</span>
                    <span className="fee-amount">₹{data.fees.totalAmount}</span>
                  </div>
                  <div className="fee-box paid">
                    <span className="fee-label">Paid</span>
                    <span className="fee-amount">₹{data.fees.paidAmount}</span>
                  </div>
                  <div className="fee-box pending">
                    <span className="fee-label">Pending</span>
                    <span className="fee-amount">₹{data.fees.dueAmount}</span>
                  </div>
                </div>
                <div className="fee-progress">
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${(data.fees.paidAmount / data.fees.totalAmount) * 100}%` }}
                    ></div>
                  </div>
                  <p className="progress-text">
                    {Math.round((data.fees.paidAmount / data.fees.totalAmount) * 100)}% Paid
                  </p>
                </div>
                {data.fees.dueAmount > 0 && (
                  <button className="student-pay-btn">Pay Pending Fees ₹{data.fees.dueAmount}</button>
                )}
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="student-documents">
              <h1>📂 My Documents</h1>
              <div className="documents-grid">
                {data.documents.map((doc, idx) => (
                  <div key={idx} className={`doc-card status-${doc.status.toLowerCase()}`}>
                    <div className="doc-icon">📄</div>
                    <h3>{doc.name}</h3>
                    <p className="doc-status">
                      {doc.status === 'Submitted' ? '✅ Submitted' : '⏳ Pending'}
                    </p>
                    {doc.uploadedAt && <p className="doc-date">{doc.uploadedAt}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Help Tab */}
          {activeTab === 'help' && (
            <div className="student-help">
              <h1>🆘 Help & Support</h1>
              <div className="help-cards">
                <div className="help-card">
                  <h3>❓ Frequently Asked Questions</h3>
                  <ul>
                    <li>How do I check my marks?</li>
                    <li>When are fees due?</li>
                    <li>How do I submit documents?</li>
                    <li>How do I contact my teacher?</li>
                  </ul>
                </div>
                <div className="help-card">
                  <h3>📞 Contact Support</h3>
                  <p>📧 Email: support@college.edu</p>
                  <p>📱 Phone: +91-9876-543210</p>
                  <p>⏰ Available: Mon-Fri, 9 AM - 5 PM</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
