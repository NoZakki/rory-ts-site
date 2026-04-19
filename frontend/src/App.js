/**
 * Main App Component
 * Root component with routing configuration
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';\nimport AdminPage from './pages/AdminPage';
import AdminPage from './pages/AdminPage';
import SupportPage from './pages/SupportPage';
import FilesPage from './pages/FilesPage';
import UploadPage from './pages/UploadPage';
import SharedFilePage from './pages/SharedFilePage';
import WorkInProgressPage from './pages/WorkInProgressPage';
import './styles/index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/share/:shareToken" element={<SharedFilePage />} />

          {/* Admin routes */}
          <Route path=\"/admin-login\" element={<AdminLoginPage />} />\n          <Route path=\"/admin\" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminPage />} />

          {/* Support route */}
          <Route path="/support" element={<SupportPage />} />

          {/* Work in progress route */}
          <Route path="/wip" element={<WorkInProgressPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/files"
            element={
              <ProtectedRoute>
                <FilesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
