import React from 'react';
import AdminContentPanel from '../admin/AdminContentPanel';

const AdminSite = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4 mb-8">
        <h1 className="text-xl font-bold text-gray-800">Painel Admin - Edição do Site</h1>
      </nav>
      <main>
        <AdminContentPanel />
      </main>
    </div>
  );
};

export default AdminSite;
