import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/Admin/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <AdminSidebar />
      <div className="flex-1 w-full lg:w-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
