import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const LoginPlaceholder = () => <div className="p-8 font-sans">🔓 Login View Active</div>;
const DashboardPlaceholder = () => <div className="p-8 font-sans">📊 Dashboard View Active</div>;
const UnauthorizedView = () => <div className="p-8 font-sans text-red-500">🚫 Security Halt: Access Revoked</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPlaceholder />} />
          <Route path="/unauthorized" element={<UnauthorizedView />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['User', 'Manager', 'Admin']}>
                <DashboardPlaceholder />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;