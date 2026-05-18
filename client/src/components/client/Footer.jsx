import React from 'react';

function Footer() {
  return (
    <footer style={{ 
      backgroundColor: '#000000', 
      color: '#fff', 
      padding: '50px 8% 25px 8%', /* Đẩy lề thụt vào cân bằng với Navbar */
      marginTop: '60px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      
      {/* Khung chia 3 cột dàn ngang rõ ràng */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr 1fr', /* Cột chứa logo rộng gấp đôi các cột thông tin */
        gap: '40px', 
        alignItems: 'start'
      }}>
        
        {/* CỘT 1: LOGO VÀ SLOGAN */}
        <div style={{ textAlign: 'left' }}>
          <img
            src="/src/assets/logo_darkstyle.jpg"
            alt="Sen Đông Logo"
            style={{ width: "240px", height: "auto", marginBottom: "15px", objectFit: "contain" }}
          />
          <p style={{ color: "#aaa", fontSize: "14px", margin: 0 }}>
            Sen Đông - Mỗi bức tranh, một cảm xúc
          </p>
        </div>

        {/* CỘT 2: HỖ TRỢ KHÁCH HÀNG */}
        <div style={{ textAlign: 'left' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '18px', color: '#fff' }}>
            Hỗ Trợ Khách Hàng
          </h4>
          <p style={{ color: '#aaa', fontSize: '14px', margin: '0 0 10px 0', cursor: 'pointer' }}>Chính sách bảo hành khung tranh</p>
          <p style={{ color: '#aaa', fontSize: '14px', margin: 0, cursor: 'pointer' }}>Hướng dẫn chọn kích thước tranh</p>
        </div>

        {/* CỘT 3: THÔNG TIN LIÊN HỆ */}
        <div style={{ textAlign: 'left' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '18px', color: '#fff' }}>
            Liên Hệ Xưởng
          </h4>
          <p style={{ color: '#aaa', fontSize: '14px', margin: '0 0 10px 0' }}>📍 Địa chỉ: STU, Ho Chi Minh City</p>
          <p style={{ color: '#aaa', fontSize: '14px', margin: 0 }}>📞 Hotline: 093 xxxx xxx</p>
        </div>

      </div>

      {/* DÒNG COPYRIGHT PHÍA DƯỚI */}
      <div style={{ 
        textAlign: 'left', 
        borderTop: '1px solid #222', 
        marginTop: '40px', 
        paddingTop: '20px', 
        fontSize: '13px', 
        color: '#666' 
      }}>
        ©SenDong All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;