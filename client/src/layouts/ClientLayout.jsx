import { Outlet } from 'react-router-dom';
import Navbar from '../components/client/Navbar';
import Footer from '../components/client/Footer';

function ClientLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Navbar />
      <main style={{ flex: 1, width: '100%', boxSizing: 'border-box' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default ClientLayout;
