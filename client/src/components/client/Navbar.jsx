import React from 'react';

function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 8%', /* Tăng padding để menu thụt vào trong cân đối */
      backgroundColor: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Logo xưởng tranh */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src="/src/assets/logo.png"
          alt="Logo"
          style={{ width: "200px", height: "auto", objectFit: 'contain' }}
        />
      </div>

      {/* Menu điều hướng - Cam kết dàn ngang */}
      <ul style={{ 
        display: 'flex', 
        flexDirection: 'row',
        listStyle: 'none', 
        gap: '35px', 
        margin: 0, 
        padding: 0 
      }}>
        <li><a href="/" style={{ textDecoration: 'none', color: '#111', fontWeight: '700', fontSize: '15px' }}>Trang Chủ</a></li>
        <li><a href="/gioi-thieu" style={{ textDecoration: 'none', color: '#555', fontWeight: '500', fontSize: '15px' }}>Giới thiệu</a></li>
        <li><a href="/bo-suu-tap" style={{ textDecoration: 'none', color: '#555', fontWeight: '500', fontSize: '15px' }}>Bộ sưu tập</a></li>
        <li><a href="/khuyen-mai" style={{ textDecoration: 'none', color: '#555', fontWeight: '500', fontSize: '15px' }}>Khuyến mãi</a></li>
      </ul>

      {/* Góc phải: Tài khoản & Giỏ hàng */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: '25px', alignItems: 'center' }}>
        <a href="/tai-khoan" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/src/assets/user.png" alt="User" style={{ width: "22px", height: "22px" }} />
        </a>
        <a href="/gio-hang" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/src/assets/shopping_cart.jpg" alt="Cart" style={{ width: "22px", height: "22px" }} />
        </a>
      </div>
    </nav>
  );
}

export default Navbar;