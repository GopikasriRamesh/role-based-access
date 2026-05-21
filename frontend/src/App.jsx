import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import CreateRequest from './pages/CreateRequest';
import Dashboard from './pages/Dashboard';

const UnauthorizedView = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-center">
    <div className="bg-white rounded-2xl shadow-xl max-w-md p-8 border border-slate-100">
      <div className="h-12 w-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center font-bold text-xl mx-auto mb-4">
        🚫
      </div>
      <h1 className="text-xl font-bold text-slate-900">Security Barrier Triggered</h1>
      <p className="text-slate-500 text-sm mt-2">
        Your designated access token layer does not hold permission parameters to view this structural sub-route context.
      </p>
      <a 
        href="/dashboard" 
        className="mt-6 inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all"
      >
        Return to Safe Node
      </a>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<UnauthorizedView />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['User', 'Manager', 'Admin']}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-request" 
            element={
              <ProtectedRoute allowedRoles={['User']}>
                <CreateRequest />
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