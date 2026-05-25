import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';

function AdminLayout() {
  return (
    <div className="admin-layout" style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
