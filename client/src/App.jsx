import React from 'react';
import Navbar from './components/client/Navbar';
import Footer from './components/client/Footer';
import Home from './pages/client/Home';

function App() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', /* Đảm bảo giao diện luôn full màn hình dọc */
      backgroundColor: '#ffffff' 
    }}>
      {/* 1. THANH MENU TRÊN CÙNG */}
      
      <Navbar />
    
      {/* 2. NỘI DUNG TRANG CHỦ CHÍNH */}
      {/* Giới hạn độ rộng tối đa 1280px và căn giữa để không bị tràn viền */}
      <main style={{ 
        flex: 1, /* Đẩy Footer xuống đáy trang nếu ít nội dung */
        maxWidth: '1280px', 
        width: '100%',
        margin: '0 auto', 
        padding: '40px 20px',
        boxSizing: 'border-box'
      }}>
        <Home />
      </main>

      {/* 3. CHÂN TRANG */}
      <Footer />
    </div>
  );
}

export default App;