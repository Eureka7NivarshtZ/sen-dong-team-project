import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

function CartCheckout() {
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useCart();
  // Quản lý các bước: 1: Giỏ hàng, 2: Thông tin đặt hàng, 3: Vận chuyển, 4: Thanh toán, 5: Thành công
  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({ name: '', phone: '', address: '', note: '', method: 'standard', payment: 'cod' });

  // Hàm chuyển đổi chuỗi giá "3.600.000 đ" về dạng Số nguyên để tính toán tiền bạc
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    if (typeof priceStr === 'number') return priceStr;
    return parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
  };

  // Tính tiền tranh (subtotal) an toàn bằng việc phòng hờ trường hợp mảng trống hoặc undefined
  const subtotal = (cartItems || []).reduce((sum, item) => {
    return sum + (parsePrice(item.price) * item.quantity);
  }, 0);

  const shippingFee = shippingInfo.method === 'express' ? 50000 : 30000;
  const total = subtotal + (step >= 3 ? shippingFee : 0);

  const formatPrice = (num) => num.toLocaleString('vi-VN') + ' đ';

  const stepsTitle = [
    { id: 1, label: "Giỏ hàng" },
    { id: 2, label: "Thông tin đặt hàng" },
    { id: 3, label: "Vận chuyển" },
    { id: 4, label: "Thanh toán" }
  ];

  return (
    <div style={{ width: "100%", boxSizing: "border-box", fontFamily: "Arial, sans-serif", backgroundColor: "#ffffff", padding: "40px 100px 80px 100px" }}>
      
      {step < 5 && (
        <div style={{ textAlign: "left", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "normal", color: "#111111", margin: 0 }}>
            {step === 1 ? "Giỏ hàng" : step === 2 ? "Thông tin đặt hàng" : step === 3 ? "Vận chuyển" : "Thanh toán"}
          </h1>
        </div>
      )}

      {/* THANH ĐIỀU HƯỚNG TIẾN TRÌNH - BẤM ĐỂ CHUYỂN QUA LẠI GIỮA CÁC TRANG */}
      {step < 5 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
          {stepsTitle.map((s, index) => (
            <React.Fragment key={s.id}>
              <div 
                onClick={() => step !== 5 && setStep(s.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: step === s.id ? '#1c3f3a' : '#aaaaaa', fontWeight: step === s.id ? 'bold' : 'normal' }}
              >
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: step === s.id ? '#1c3f3a' : '#f0f0f0', color: step === s.id ? '#fff' : '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                  {s.id}
                </div>
                <span style={{ fontSize: '14px' }}>{s.label}</span>
              </div>
              {index < stepsTitle.length - 1 && <div style={{ width: '40px', height: '1px', backgroundColor: '#ddd' }} />}
            </React.Fragment>
          ))}
        </div>
      )}

      <div style={{ textAlign: 'left' }}>
        
        {/* ================= BƯỚC 1: GIỎ HÀNG ================= */}
        {step === 1 && (
          (!cartItems || cartItems.length === 0) ? (
            /* HIỂN THỊ KHI CHƯA MUA GÌ (GIỎ HÀNG TRỐNG) */
            <div style={{ textAlign: "center", padding: "80px 0", color: "#888888" }}>
              <div style={{ fontSize: "50px", marginBottom: "15px" }}>🛒</div>
              <p style={{ fontSize: "16px", margin: "0 0 20px 0" }}>Giỏ hàng trống</p>
              <button onClick={() => navigate('/bo-suu-tap')} style={{ padding: "10px 20px", backgroundColor: "#1c3f3a", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Khám phá bộ sưu tập ngay</button>
            </div>
          ) : (
            /* HIỂN THỊ DANH SÁCH KHI ĐÃ CÓ TRANH TRONG GIỎ */
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '60px' }}>
              {/* Cột danh sách sản phẩm tranh */}
              <div>
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '25px', padding: '20px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <img src={item.image} alt={item.title} style={{ width: '90px', height: '90px', objectFit: 'contain', backgroundColor: '#f9f9f9', borderRadius: '4px' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 'bold' }}>{item.title}</h4>
                      <span style={{ color: '#888', fontSize: '13px' }}>{item.category}</span>
                      <div style={{ marginTop: '10px', fontWeight: 'bold', fontSize: '15px' }}>{typeof item.price === 'number' ? formatPrice(item.price) : item.price}</div>
                    </div>
                    
                    {/* CỤM ĐIỀU CHỈNH TĂNG GIẢM SỐ LƯỢNG & NÚT XÓA CHỮ ĐỎ KẾ BÊN CHUẨN FIGMA */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #ddd', padding: '4px 12px', borderRadius: '4px' }}>
                        <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' }} onClick={() => item.quantity > 1 ? setCartItems(cartItems.map(i => i.id === item.id ? {...i, quantity: i.quantity - 1} : i)) : null}>-</button>
                        <span style={{ fontSize: '14px' }}>{item.quantity}</span>
                        <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' }} onClick={() => setCartItems(cartItems.map(i => i.id === item.id ? {...i, quantity: i.quantity + 1} : i))}>+</button>
                      </div>
                      
                      {/* Nút xóa tranh */}
                      <button 
                        onClick={() => setCartItems(cartItems.filter(i => i.id !== item.id))}
                        style={{ border: 'none', background: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '14px', fontWeight: '500', padding: '5px' }}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Khối tóm tắt tính tiền đơn hàng bên phải */}
              <div style={{ border: '1px solid #f0f0f0', padding: '25px', borderRadius: '8px', height: 'fit-content', backgroundColor: '#fafafa' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Tóm tắt đơn hàng</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span>Tạm tính</span>
                  <strong style={{ fontSize: '16px' }}>{formatPrice(subtotal)}</strong>
                </div>
                <button onClick={() => setStep(2)} style={{ width: '100%', padding: '14px 0', backgroundColor: '#1c3f3a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                  Tiến hành thanh toán
                </button>
              </div>
            </div>
          )
        )}

        {/* ================= BƯỚC 2: THÔNG TIN ĐẶT HÀNG ================= */}
        {step === 2 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '60px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="Họ và tên *" value={shippingInfo.name} onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              <input type="text" placeholder="Số điện thoại *" value={shippingInfo.phone} onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              <input type="text" placeholder="Địa chỉ nhận tranh chi tiết *" value={shippingInfo.address} onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              <textarea placeholder="Ghi chú đơn hàng..." rows="3" value={shippingInfo.note} onChange={(e) => setShippingInfo({...shippingInfo, note: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', resize: 'none' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button onClick={() => setStep(1)} style={{ padding: '10px 20px', background: 'none', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>Quay lại</button>
                <button onClick={() => setStep(3)} style={{ padding: '12px 25px', backgroundColor: '#1c3f3a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Tiếp tục vận chuyển</button>
              </div>
            </div>
            <div style={{ border: '1px solid #f0f0f0', padding: '20px', borderRadius: '8px', backgroundColor: '#fafafa' }}>
              <h4>Sản phẩm ({cartItems.length})</h4>
              {cartItems.map(i => <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}><span>{i.title} x{i.quantity}</span><span>{typeof i.price === 'number' ? formatPrice(i.price) : i.price}</span></div>)}
              <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}><span>Tạm tính</span><strong>{formatPrice(subtotal)}</strong></div>
            </div>
          </div>
        )}

        {/* ================= BƯỚC 3: VẬN CHUYỂN ================= */}
        {step === 3 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '60px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div onClick={() => setShippingInfo({...shippingInfo, method: 'standard'})} style={{ display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid', borderColor: shippingInfo.method === 'standard' ? '#1c3f3a' : '#eee', padding: '20px', borderRadius: '6px', cursor: 'pointer' }}>
                <input type="radio" checked={shippingInfo.method === 'standard'} readOnly />
                <div style={{ flex: 1 }}><h4>Giao hàng Tiêu Chuẩn</h4><p style={{ margin: 0, fontSize: '13px', color: '#666' }}>Nhận tranh sau 3-5 ngày làm việc</p></div>
                <strong>30.000 đ</strong>
              </div>
              <div onClick={() => setShippingInfo({...shippingInfo, method: 'express'})} style={{ display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid', borderColor: shippingInfo.method === 'express' ? '#1c3f3a' : '#eee', padding: '20px', borderRadius: '6px', cursor: 'pointer' }}>
                <input type="radio" checked={shippingInfo.method === 'express'} readOnly />
                <div style={{ flex: 1 }}><h4>Giao hàng Hỏa tốc</h4><p style={{ margin: 0, fontSize: '13px', color: '#666' }}>Nhận tranh ngay trong ngày</p></div>
                <strong>50.000 đ</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button onClick={() => setStep(2)} style={{ padding: '10px 20px', background: 'none', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>Quay lại</button>
                <button onClick={() => setStep(4)} style={{ padding: '12px 25px', backgroundColor: '#1c3f3a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Tiếp tục thanh toán</button>
              </div>
            </div>
            <div style={{ border: '1px solid #f0f0f0', padding: '20px', borderRadius: '8px', backgroundColor: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>Tiền hàng</span><span>{formatPrice(subtotal)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>Phí vận chuyển</span><span>{formatPrice(shippingFee)}</span></div>
              <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}><span>Tổng tiền</span><strong style={{ color: '#1c3f3a', fontSize: '18px' }}>{formatPrice(total)}</strong></div>
            </div>
          </div>
        )}

        {/* ================= BƯỚC 4: THANH TOÁN ================= */}
        {step === 4 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '60px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div onClick={() => setShippingInfo({...shippingInfo, payment: 'cod'})} style={{ display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid', borderColor: shippingInfo.payment === 'cod' ? '#1c3f3a' : '#eee', padding: '20px', borderRadius: '6px', cursor: 'pointer' }}>
                <input type="radio" checked={shippingInfo.payment === 'cod'} readOnly />
                <h4>Thanh toán khi nhận hàng (COD)</h4>
              </div>
              <div onClick={() => setShippingInfo({...shippingInfo, payment: 'bank'})} style={{ display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid', borderColor: shippingInfo.payment === 'bank' ? '#1c3f3a' : '#eee', padding: '20px', borderRadius: '6px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <input type="radio" checked={shippingInfo.payment === 'bank'} readOnly />
                  <h4>Chuyển khoản tài khoản ngân hàng</h4>
                </div>
                {shippingInfo.payment === 'bank' && (
                  <div style={{ padding: '10px 30px', color: '#555', fontSize: '14px', lineHeight: '1.6' }}>
                    Số tài khoản: <strong>123456789</strong><br/> Ngân hàng: <strong>Vietcombank</strong><br/> Chủ tài khoản: <strong>XUỞNG TRANH SEN ĐÔNG</strong>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button onClick={() => setStep(3)} style={{ padding: '10px 20px', background: 'none', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>Quay lại</button>
                <button onClick={() => setStep(5)} style={{ padding: '12px 30px', backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>Đặt hàng ngay</button>
              </div>
            </div>
            <div style={{ border: '1px solid #f0f0f0', padding: '20px', borderRadius: '8px', backgroundColor: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tổng thanh toán</span><strong style={{ color: '#2e7d32', fontSize: '18px' }}>{formatPrice(total)}</strong></div>
            </div>
          </div>
        )}

        {/* ================= BƯỚC 5: ĐẶT HÀNG THÀNH CÔNG ================= */}
        {step === 5 && (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#e8f5e9', color: '#2e7d32', fontSize: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>✓</div>
            <h2 style={{ color: '#2e7d32', margin: '0 0 10px 0' }}>Đặt hàng thành công!</h2>
            <p style={{ color: '#555', maxWidth: '500px', margin: '0 auto 30px auto', lineHeight: '1.6' }}>Cảm ơn bạn đã ủng hộ xưởng tranh Sen Đông. Nhân viên xưởng sẽ sớm liên hệ qua điện thoại để xác nhận đơn hàng.</p>
            <button onClick={() => { setStep(1); setCartItems([]); navigate('/'); }} style={{ padding: '12px 24px', backgroundColor: '#1c3f3a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Quay lại trang chủ</button>
          </div>
        )}

      </div>
    </div>
  );
}

export default CartCheckout;