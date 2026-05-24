import React, { useState } from 'react';

function Register({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    alert('Đăng ký tài khoản thành công!');
    onNavigate('login'); // Đăng ký xong chuyển sang trang Đăng nhập
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
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#111' }}>Đăng ký</h2>
        <p style={{ fontSize: '14px', color: '#666', margin: '0 0 30px 0' }}>Tạo tài khoản để tiếp tục</p>

        <form onSubmit={handleRegister} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Email:</label>
            <input type="email" placeholder="Vui lòng nhập email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e0e0e0', backgroundColor: '#f4f6f9', boxSizing: 'border-box' }} required />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Tài khoản</label>
            <input type="text" placeholder="Vui lòng nhập tên tài khoản" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e0e0e0', backgroundColor: '#f4f6f9', boxSizing: 'border-box' }} required />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '14px', color: '#333' }}>Mật khẩu</label>
              <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>Quên mật khẩu?</a>
            </div>
            <input type="password" placeholder="Vui lòng nhập mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e0e0e0', backgroundColor: '#f4f6f9', boxSizing: 'border-box' }} required />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '30px' }}>
            <input type="checkbox" id="terms" defaultChecked required style={{ cursor: 'pointer' }} />
            <label htmlFor="terms" style={{ fontSize: '13px', color: '#666', cursor: 'pointer' }}>Tôi đồng ý với các điều khoản</label>
          </div>

          <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#5cb384', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
            Đăng ký
          </button>
        </form>

        <p style={{ fontSize: '14px', color: '#555', marginTop: '25px', marginBottom: 0 }}>
          Đã có tài khoản ? <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('login'); }} style={{ color: '#2f80ed', textDecoration: 'none', fontWeight: 'bold' }}>Đăng nhập</a>
        </p>
      </div>
    </div>
  );
}

export default Register;