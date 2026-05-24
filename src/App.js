import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import AdminRoute from './components/AdminRoute';
import StudentRoute from './components/StudentRoute';
import TeacherRoute from './components/TeacherRoute';
import ThemeToggle from './components/ThemeToggle';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentLoginPage from './pages/StudentLoginPage';
import StudentRegisterPage from './pages/StudentRegisterPage';
import DashboardPage from './pages/DashboardPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import TeacherDashboardPage from './pages/TeacherDashboardPage';
import UserManagementPage from './pages/UserManagementPage';
import StudentManagementPage from './pages/StudentManagementPage';
import DocumentManagementPage from './pages/DocumentManagementPage';
import MarksManagementPage from './pages/MarksManagementPage';
import FeeManagementPage from './pages/FeeManagementPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ThemeToggle />
        <Routes>
          {/* Home Page - Role Selection */}
          <Route path="/" element={<HomePage />} />

          {/* Admin/Teacher Login & Register */}
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/register"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <RegisterPage />
                </AdminRoute>
              </ProtectedRoute>
            }
          />

          {/* Admin/Teacher Dashboard with Layout */}
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="dashboard" element={<TeacherRoute><DashboardPage /></TeacherRoute>} />
            <Route path="teacher-dashboard" element={<TeacherRoute><TeacherDashboardPage /></TeacherRoute>} />
            <Route path="users" element={<AdminRoute><UserManagementPage /></AdminRoute>} />
            <Route path="students" element={<StudentManagementPage />} />
            <Route path="documents" element={<DocumentManagementPage />} />
            <Route path="marks" element={<MarksManagementPage />} />
            <Route path="fees" element={<FeeManagementPage />} />
          </Route>

          {/* Student Portal */}
          <Route path="/student/login" element={<StudentLoginPage />} />
          <Route path="/student/register" element={<StudentRegisterPage />} />
          <Route path="/student/dashboard" element={<StudentRoute><StudentDashboardPage /></StudentRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
