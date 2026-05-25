import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 1. XỬ LÝ ĐĂNG NHẬP VỚI QUYỀN USER THÔNG THƯỜNG
  const handleUserLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', 'user');
    alert('Đăng nhập thành công với quyền Khách hàng!');
    navigate('/');
  };

  // 2. XỬ LÝ ĐĂNG NHẬP VỚI QUYỀN ADMIN (CHỈ KHI BẤM NÚT ADMIN)
  const handleAdminLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', 'admin');
    alert('Đăng nhập thành công với quyền Quản trị viên Admin!');
    navigate('/');
  };

  return (
    <div style={{
      width: '100%', minHeight: 'calc(100vh - 70px)', backgroundColor: '#5cb384',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#ffffff', width: '480px', borderRadius: '24px',
        padding: '50px 40px', boxSizing: 'border-box', textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#111' }}>Đăng nhập</h2>
        <p style={{ fontSize: '14px', color: '#666', margin: '0 0 30px 0' }}>Vui lòng nhập email và mật khẩu để tiếp tục</p>

        <form style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Email:</label>
            <input type="email" placeholder="Vui lòng nhập email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e0e0e0', backgroundColor: '#f4f6f9', boxSizing: 'border-box' }} required />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '14px', color: '#333' }}>Mật Khẩu:</label>
              <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>Quên mật khẩu?</a>
            </div>
            <input type="password" placeholder="Vui lòng nhập mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e0e0e0', backgroundColor: '#f4f6f9', boxSizing: 'border-box' }} required />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '25px' }}>
            <input type="checkbox" id="remember" defaultChecked style={{ cursor: 'pointer' }} />
            <label htmlFor="remember" style={{ fontSize: '13px', color: '#666', cursor: 'pointer' }}>Nhớ mật khẩu</label>
          </div>

          {/* NÚT 1: ĐĂNG NHẬP QUYỀN USER (MÀU XANH THEO FIGMA) */}
          <button 
            type="button" 
            onClick={handleUserLogin}
            style={{ width: '100%', padding: '14px', backgroundColor: '#5cb384', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '12px', transition: 'background 0.2s' }}
          >
            Đăng nhập
          </button>

          {/* NÚT 2: ĐĂNG NHẬP QUYỀN ADMIN (MÀU TỐI SANG TRỌNG) */}
          <button 
            type="button" 
            onClick={handleAdminLogin}
            style={{ width: '100%', padding: '14px', backgroundColor: '#1c3f3a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}
          >
            Đăng nhập với quyền Admin 🛠️
          </button>
        </form>

        <p style={{ fontSize: '14px', color: '#555', marginTop: '25px', marginBottom: 0 }}>
          Chưa có tài khoản? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/dang-ky'); }} style={{ color: '#2f80ed', textDecoration: 'none', fontWeight: 'bold' }}>Tạo tài khoản</a>
        </p>
      </div>
    </div>
  );
}

export default Login;