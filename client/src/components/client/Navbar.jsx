import React, { useState } from 'react';

const Navbar = ({ onNavigate, currentTab }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Kiểm tra trạng thái đăng nhập thực tế từ localStorage
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');

  const handleUserIconClick = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      // Nếu chưa đăng nhập thì dẫn thẳng về trang login
      onNavigate('login');
    } else {
      // Nếu đã đăng nhập thì bật/tắt cái Menu nhỏ lựa chọn quyền Admin
      setShowDropdown(!showDropdown);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setShowDropdown(false);
    alert('Đã đăng xuất tài khoản!');
    onNavigate('home');
  };

  return (
    <header 
      style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 100px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#ffffff',
        position: 'sticky', top: 0, zIndex: 1000, fontFamily: "'Inter', Arial, sans-serif", 
        boxSizing: 'border-box', width: '100%', height: '70px', 
      }}
    >
      {/* 1. KHỐI LOGO BÊN TRÁI */}
      <div className="logo" onClick={() => onNavigate('home')} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
        <img src="/src/assets/Logo.png" alt="Sen Đông Logo" style={{ width: '200px', height: '200px', objectFit: 'contain' }} onError={(e) => { e.target.src = "https://via.placeholder.com/40?text=SD" }} />
      </div>

      {/* 2. MENU ĐIỀU HƯỚNG Ở GIỮA */}
      <nav style={{ display: 'block' }}>
        <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '40px', alignItems: 'center', height: '100%' }}>
          {/* TRANG CHỦ */}
          <li style={{ position: 'relative', height: '70px', display: 'flex', alignItems: 'center' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} style={{ textDecoration: 'none', fontSize: '15px', color: currentTab === 'home' ? '#2e7d32' : '#333333', fontWeight: currentTab === 'home' ? '700' : '500' }}>Trang Chủ</a>
            {currentTab === 'home' && <span style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '3px', backgroundColor: '#2e7d32', borderRadius: '2px' }}></span>}
          </li>
          {/* GIỚI THIỆU */}
          <li style={{ position: 'relative', height: '70px', display: 'flex', alignItems: 'center' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} style={{ textDecoration: 'none', fontSize: '15px', color: currentTab === 'about' ? '#2e7d32' : '#333333', fontWeight: currentTab === 'about' ? '700' : '500' }}>Giới thiệu</a>
            {currentTab === 'about' && <span style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '3px', backgroundColor: '#2e7d32', borderRadius: '2px' }}></span>}
          </li>
          {/* BỘ SƯU TẬP */}
          <li style={{ position: 'relative', height: '70px', display: 'flex', alignItems: 'center' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('collection'); }} style={{ textDecoration: 'none', fontSize: '15px', color: currentTab === 'collection' ? '#2e7d32' : '#333333', fontWeight: currentTab === 'collection' ? '700' : '500' }}>Bộ sưu tập</a>
            {currentTab === 'collection' && <span style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '3px', backgroundColor: '#2e7d32', borderRadius: '2px' }}></span>}
          </li>
          {/* GIỎ HÀNG */}
          <li style={{ position: 'relative', height: '70px', display: 'flex', alignItems: 'center' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('cart'); }} style={{ textDecoration: 'none', fontSize: '15px', color: currentTab === 'cart' ? '#2e7d32' : '#333333', fontWeight: currentTab === 'cart' ? '700' : '500' }}>Giỏ hàng</a>
            {currentTab === 'cart' && <span style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '3px', backgroundColor: '#2e7d32', borderRadius: '2px' }}></span>}
          </li>
        </ul>
      </nav>

      {/* 3. CỤM ICON TÀI KHOẢN CÓ DROPDOWN CHỌN QUYỀN ADMIN */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', position: 'relative' }}>
        <a 
          href="#" 
          onClick={handleUserIconClick}
          style={{ display: 'flex', alignItems: 'center', color: isLoggedIn ? '#2e7d32' : '#333333', transition: 'color 0.2s' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </a>

        {/* MENU POPUP THẢ XUỐNG KHI BẤM VÀO ICON USER ĐÃ ĐĂNG NHẬP */}
        {showDropdown && (
          <div style={{
            position: 'absolute', top: '40px', right: 0, backgroundColor: '#ffffff',
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)', borderRadius: '8px', width: '180px',
            padding: '8px 0', zIndex: 2000, border: '1px solid #f0f0f0', textAlign: 'left'
          }}>
            {userRole === 'admin' && (
              <div 
                onClick={() => { setShowDropdown(false); onNavigate('admin-dashboard'); }}
                style={{ padding: '10px 15px', fontSize: '14px', color: '#1c3f3a', fontWeight: 'bold', cursor: 'pointer', backgroundColor: '#f9f9f9' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#edf5f1'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
              >
                ⚙️ Quản trị Admin
              </div>
            )}
            <div 
              onClick={handleLogout}
              style={{ padding: '10px 15px', fontSize: '14px', color: '#e74c3c', cursor: 'pointer' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              🚪 Đăng xuất
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;