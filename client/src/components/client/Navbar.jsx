import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Kiểm tra trạng thái đăng nhập thực tế từ localStorage
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');

  // Hàm kiểm tra xem route hiện tại có match không
  const isActive = (path) => location.pathname === path;

  const handleUserIconClick = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      // Nếu chưa đăng nhập thì dẫn thẳng về trang login
      navigate('/login');
    } else {
      // Nếu đã đăng nhập thì bật/tắt cái Menu nhỏ lựa chọn quyền Admin
      setShowDropdown(!showDropdown);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setShowDropdown(false);
    alert('Đã đăng xuất tài khoản!');
    navigate('/');
  };

  const handleNavClick = (path) => {
    navigate(path);
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
      <div className="logo" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
        <img src="/src/assets/Logo.png" alt="Sen Đông Logo" style={{ width: '200px', height: '200px', objectFit: 'contain' }} onError={(e) => { e.target.src = "https://via.placeholder.com/40?text=SD" }} />
      </div>

      {/* 2. MENU ĐIỀU HƯỚNG Ở GIỮA */}
      <nav style={{ display: 'block' }}>
        <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '40px', alignItems: 'center', height: '100%' }}>
          {/* TRANG CHỦ */}
          <li style={{ position: 'relative', height: '70px', display: 'flex', alignItems: 'center' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('/'); }} style={{ textDecoration: 'none', fontSize: '15px', color: isActive('/') ? '#2e7d32' : '#333333', fontWeight: isActive('/') ? '700' : '500' }}>Trang Chủ</a>
            {isActive('/') && <span style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '3px', backgroundColor: '#2e7d32', borderRadius: '2px' }}></span>}
          </li>
          {/* GIỚI THIỆU */}
          <li style={{ position: 'relative', height: '70px', display: 'flex', alignItems: 'center' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('/about'); }} style={{ textDecoration: 'none', fontSize: '15px', color: isActive('/about') ? '#2e7d32' : '#333333', fontWeight: isActive('/about') ? '700' : '500' }}>Giới thiệu</a>
            {isActive('/about') && <span style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '3px', backgroundColor: '#2e7d32', borderRadius: '2px' }}></span>}
          </li>
          {/* BỘ SƯU TẬP */}
          <li style={{ position: 'relative', height: '70px', display: 'flex', alignItems: 'center' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('/collection'); }} style={{ textDecoration: 'none', fontSize: '15px', color: isActive('/collection') ? '#2e7d32' : '#333333', fontWeight: isActive('/collection') ? '700' : '500' }}>Bộ sưu tập</a>
            {isActive('/collection') && <span style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '3px', backgroundColor: '#2e7d32', borderRadius: '2px' }}></span>}
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
          <i className="fa-regular fa-user"></i>
        </a>
        <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('/cart'); }} style={{ textDecoration: 'none', fontSize: '15px', color: '#333333'}}>
          <i className="fa-solid fa-cart-shopping"></i>
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
                onClick={() => { setShowDropdown(false); navigate('/admin'); }}
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