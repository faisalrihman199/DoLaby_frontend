import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/Admin/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AdminSidebar />
      <div id="app-content" className="flex-1 flex flex-col overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
