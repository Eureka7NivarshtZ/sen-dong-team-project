import React from 'react';

function ProductCard_TrangChu({ image, title, category, price }) {
  return (
    <div
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
      {/* FIX: dùng image, không dùng product.image */}
      <img
        src={image}
        alt={title}
        style={{ width: '100%', height: '230px', objectFit: 'cover' }}
      />

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
            color: '#e74c3c',
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