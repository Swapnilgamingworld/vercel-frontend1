import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import StatsCard from '../components/StatsCard';
import AnimatedBackground from '../components/AnimatedBackground';
import SimpleChart from '../components/SimpleChart';
import '../styles/TeacherDashboard.css';

export default function TeacherDashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    classesScheduled: 0,
    assignmentsSet: 0,
    studentPerformance: [],
    recentActivities: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    const loadStats = async () => {
      try {
        setStats({
          totalStudents: 45,
          classesScheduled: 12,
          assignmentsSet: 8,
          studentPerformance: [
            { name: 'Mathematics', avg: 78, count: 45 },
            { name: 'Physics', avg: 82, count: 45 },
            { name: 'Chemistry', avg: 85, count: 45 },
            { name: 'English', avg: 88, count: 45 },
          ],
          recentActivities: [
            { type: 'assignment', message: 'Set new assignment on Quantum Physics', date: '2 hours ago' },
            { type: 'grade', message: 'Graded 23 assignments', date: '5 hours ago' },
            { type: 'class', message: 'Completed class session', date: '1 day ago' },
            { type: 'message', message: 'Received 5 student queries', date: '1 day ago' },
          ],
        });
      } catch (err) {
        console.error('Unable to load dashboard data.', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <LoadingSpinner size="large" />;

  const avgPerformance = Math.round(
    stats.studentPerformance.reduce((sum, p) => sum + p.avg, 0) / (stats.studentPerformance.length || 1)
  );

  return (
    <div className="teacher-dashboard-container">
      <AnimatedBackground />

      {/* Teacher Top Navigation */}
      <nav className="teacher-navbar">
        <div className="teacher-nav-left">
          <div className="teacher-brand">
            <span className="teacher-brand-icon">👨‍🏫</span>
            <h2>Teacher Dashboard</h2>
          </div>
        </div>
        <div className="teacher-nav-right">
          <span className="teacher-school-name">St. Joseph's College</span>
          <button className="teacher-logout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </nav>

      <div className="teacher-wrapper">
        {/* Left Navigation Tabs */}
        <div className="teacher-sidebar-nav">
          <div className="nav-section">
            <h4>Main</h4>
            <button
              className={`nav-button ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveSection('dashboard')}
            >
              📊 Dashboard
            </button>
            <button
              className={`nav-button ${activeSection === 'classes' ? 'active' : ''}`}
              onClick={() => setActiveSection('classes')}
            >
              📚 My Classes
            </button>
            <button
              className={`nav-button ${activeSection === 'assignments' ? 'active' : ''}`}
              onClick={() => setActiveSection('assignments')}
            >
              ✏️ Assignments
            </button>
            <button
              className={`nav-button ${activeSection === 'grading' ? 'active' : ''}`}
              onClick={() => setActiveSection('grading')}
            >
              ⭐ Grading
            </button>
          </div>
          <div className="nav-section">
            <h4>More</h4>
            <button
              className={`nav-button ${activeSection === 'students' ? 'active' : ''}`}
              onClick={() => setActiveSection('students')}
            >
              👥 Students
            </button>
            <button
              className={`nav-button ${activeSection === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveSection('analytics')}
            >
              📈 Analytics
            </button>
            <button
              className={`nav-button ${activeSection === 'resources' ? 'active' : ''}`}
              onClick={() => setActiveSection('resources')}
            >
              📁 Resources
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="teacher-main">
          {/* Dashboard Section */}
          {activeSection === 'dashboard' && (
            <div className="teacher-section">
              <div className="section-header">
                <h1>Dashboard Overview</h1>
                <p>Your teaching statistics and recent activities</p>
              </div>

              {/* Quick Action Buttons */}
              <div className="teacher-action-buttons">
                <button className="action-btn primary">➕ Create Assignment</button>
                <button className="action-btn secondary">📅 Schedule Class</button>
                <button className="action-btn secondary">📝 Enter Grades</button>
                <button className="action-btn secondary">💬 Message Class</button>
              </div>

              {/* Stats Grid */}
              <div className="teacher-stats-grid">
                <StatsCard
                  icon="👥"
                  title="Total Students"
                  value={stats.totalStudents}
                  trend="↑"
                  color="primary"
                />
                <StatsCard
                  icon="📚"
                  title="Classes Taught"
                  value={stats.classesScheduled}
                  trend="→"
                  color="info"
                />
                <StatsCard
                  icon="✏️"
                  title="Assignments Set"
                  value={stats.assignmentsSet}
                  trend="↑"
                  color="success"
                />
                <StatsCard
                  icon="📊"
                  title="Class Avg"
                  value={`${avgPerformance}%`}
                  trend="↑"
                  color="warning"
                />
              </div>

              {/* Two Column Layout */}
              <div className="teacher-content-grid">
                <div className="teacher-card">
                  <h3>📊 Performance Chart</h3>
                  <SimpleChart
                    type="bar"
                    data={{
                      labels: stats.studentPerformance.map((p) => p.name),
                      values: stats.studentPerformance.map((p) => p.avg),
                    }}
                  />
                </div>

                <div className="teacher-card">
                  <h3>🕒 Recent Activity</h3>
                  <div className="activity-feed">
                    {stats.recentActivities.map((activity, idx) => (
                      <div key={idx} className="activity-item">
                        <span className="activity-icon">
                          {activity.type === 'assignment' && '✏️'}
                          {activity.type === 'grade' && '⭐'}
                          {activity.type === 'class' && '📚'}
                          {activity.type === 'message' && '💬'}
                        </span>
                        <div className="activity-text">
                          <p>{activity.message}</p>
                          <span>{activity.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Classes Section */}
          {activeSection === 'classes' && (
            <div className="teacher-section">
              <div className="section-header">
                <h1>My Classes</h1>
                <p>Manage your courses and class schedules</p>
              </div>
              <div className="teacher-card">
                <div className="class-list">
                  {[
                    { name: 'Class 3-A', subject: 'Computer Science', students: 45 },
                    { name: 'Class 2-B', subject: 'Mathematics', students: 42 },
                    { name: 'Class 1-C', subject: 'Physics', students: 38 },
                  ].map((cls, idx) => (
                    <div key={idx} className="class-item">
                      <div className="class-info">
                        <h4>{cls.name}</h4>
                        <p>{cls.subject}</p>
                      </div>
                      <div className="class-meta">
                        <span className="student-count">👥 {cls.students} Students</span>
                        <button className="class-btn">Manage →</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Assignments Section */}
          {activeSection === 'assignments' && (
            <div className="teacher-section">
              <div className="section-header">
                <h1>Assignments</h1>
                <p>Create and manage assignments</p>
              </div>
              <div className="teacher-card">
                <div className="assignment-list">
                  {[
                    { title: 'Quantum Physics - Chapter 5', date: 'Due: May 30', submitted: 35, pending: 10 },
                    { title: 'Database Design Project', date: 'Due: May 25', submitted: 42, pending: 3 },
                    { title: 'Math Problem Set 12', date: 'Due: May 22', submitted: 45, pending: 0 },
                  ].map((assign, idx) => (
                    <div key={idx} className="assignment-item">
                      <div className="assign-info">
                        <h4>{assign.title}</h4>
                        <p>{assign.date}</p>
                      </div>
                      <div className="assign-stats">
                        <span className="submitted">✅ {assign.submitted}</span>
                        <span className="pending">⏳ {assign.pending}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Grading Section */}
          {activeSection === 'grading' && (
            <div className="teacher-section">
              <div className="section-header">
                <h1>Grading</h1>
                <p>Grade assignments and provide feedback</p>
              </div>
              <div className="teacher-card">
                <p className="placeholder-text">📝 Grading interface will appear here</p>
              </div>
            </div>
          )}

          {/* Students Section */}
          {activeSection === 'students' && (
            <div className="teacher-section">
              <div className="section-header">
                <h1>Student Management</h1>
                <p>View and manage student information</p>
              </div>
              <div className="teacher-card">
                <p className="placeholder-text">👥 Student roster will appear here</p>
              </div>
            </div>
          )}

          {/* Analytics Section */}
          {activeSection === 'analytics' && (
            <div className="teacher-section">
              <div className="section-header">
                <h1>Analytics & Reports</h1>
                <p>Detailed performance analytics</p>
              </div>
              <div className="teacher-card">
                <p className="placeholder-text">📊 Analytics dashboard will appear here</p>
              </div>
            </div>
          )}

          {/* Resources Section */}
          {activeSection === 'resources' && (
            <div className="teacher-section">
              <div className="section-header">
                <h1>Teaching Resources</h1>
                <p>Access and manage teaching materials</p>
              </div>
              <div className="teacher-card">
                <p className="placeholder-text">📁 Resources library will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
