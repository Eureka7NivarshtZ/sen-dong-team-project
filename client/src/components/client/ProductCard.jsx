import React from 'react';

function ProductCard_TrangChu({ image, title, category, price, onOpenDetail }) {
  return (
    <div
      onClick={onOpenDetail} // Bấm vào bất kỳ đâu trên card để xem chi tiết thông tin tranh
      style={{
        border: '1px solid #eaeaea',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
        backgroundColor: '#fff',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        textAlign: 'left'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.03)';
      }}
    >
      {/* KHUNG TRANH RỘNG RÃI - KHÔNG BỊ CẮT XÉN HÌNH */}
      <div style={{ width: '100%', height: '200px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={image || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500"}
          alt={title}
          style={{ 
            maxWidth: '100%', 
            maxHeight: '100%', 
            objectFit: 'contain' // Đảm bảo tranh hiển thị trọn vẹn bề ngang và bề dọc
          }}
        />
      </div>

      <div style={{ padding: '15px' }}>
        <span style={{
          fontSize: '12px',
          color: '#95a5a6',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {category}
        </span>

        <h4 style={{
          margin: '5px 0 12px 0',
          fontSize: '15px',
          color: '#2c3e50',
          fontWeight: '600',
          height: '40px',
          overflow: 'hidden'
        }}>
          {title}
        </h4>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            fontWeight: 'bold',
            color: '#faa22f', // Đồng bộ màu xanh lục chủ đạo của xưởng
            fontSize: '16px'
          }}>
            {price}
          </span>

          <button style={{
            padding: '6px 14px',
            backgroundColor: '#111',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px'
          }}>
            + Thêm sản phẩm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard_TrangChu;