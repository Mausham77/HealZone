import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Base route for /admin */}
      <Route path="/" element={<AdminDashboard />} />
      {/* Optional: Handle other admin sub-routes if needed */}
      {/* <Route path="/settings" element={<AdminSettings />} /> */}
      {/* Redirect unknown sub-routes to /admin */}
      <Route path="*" element={<AdminDashboard />} />
    </Routes>
  );
};

export default AdminRoutes;