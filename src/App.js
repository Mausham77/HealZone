// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AdminRoutes from './routes/AdminRoutes';
import Login from './components/Login';
import Register from './components/Register';
import PublicHome from './components/Home'; // Import the new PublicHome component
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import './App.css';

const RoleBasedRoute = ({ adminOnly, children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  if (!adminOnly && user.role === 'Admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

const HomeRoute = () => {
  const { user } = useAuth();
  if (user) {
    return user.role === 'Admin' ? <Navigate to="/admin" /> : <Dashboard />;
  } else {
    return <PublicHome />;
  }
};

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            {/* Home route for non-authenticated or authenticated users */}
            <Route path="/" element={<HomeRoute />} />

            {/* Admin routes */}
            <Route
              path="/admin/*"
              element={
                <RoleBasedRoute adminOnly={true}>
                  <AdminRoutes />
                </RoleBasedRoute>
              }
            />

            {/* Login and Register routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Redirect for undefined routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
