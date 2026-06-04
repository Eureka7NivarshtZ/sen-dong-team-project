import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services";
import apiClient from "../../services/apiClient";

function Profile() {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const layDonHangThat = async () => {
      try {
        const res = await apiClient.get("/don-hang/cua-toi"); 
        if (res.data && res.data.success) {
          setOrders(res.data.data || []);
        }
      } catch (err) {
        console.error("Lỗi lấy đơn hàng thật:", err);
      } finally {
        setLoading(false);
      }
    };
    if (authService.isAuthenticated()) layDonHangThat();
  }, []);

  // 🌟 ĐÃ ĐỒNG BỘ: Đổi chuẩn tên biến trạng thái đồng nhất với cơ sở dữ liệu Backend SQL
  const milestones = [
    { status: "cho_xac_nhan", label: "Chờ xác nhận" },
    { status: "dang_chuan_bi", label: "Đang chuẩn bị" },
    { status: "dang_giao", label: "Đang giao" },
    { status: "hoan_thanh", label: "Đánh Giá" }
  ];

  const getStepIndex = (status) => {
    if (status === "huy") return -1;
    const index = milestones.findIndex(m => m.status === status);
    return index !== -1 ? index : 0;
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "0 20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#1c3f3a", textAlign: "left", borderBottom: "2px solid #1c3f3a", paddingBottom: "10px", fontWeight: "bold" }}>👤 Hồ Sơ Khách Hàng</h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "0.32fr 0.68fr", gap: "40px", marginTop: "30px", textAlign: "left" }}>
        
        {/* THÔNG TIN TÀI KHOẢN */}
        <div style={{ background: "#f8f9fa", padding: "25px", borderRadius: "8px", border: "1px solid #eee", height: "fit-content" }}>
          <h3 style={{ margin: "0 0 20px 0", fontSize: "17px", color: "#333", fontWeight: "bold" }}>Thông tin tài khoản</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px", fontSize: "14px" }}>
            <div><strong style={{ color: "#666" }}>Họ và tên:</strong><div style={{ fontSize: "15px", marginTop: "4px", fontWeight: "600" }}>{user?.hoTen || user?.ten || "Khách hàng Sen Đông"}</div></div>
            <div><strong style={{ color: "#666" }}>Địa chỉ Email:</strong><div style={{ fontSize: "15px", marginTop: "4px" }}>{user?.email || "Chưa cập nhật"}</div></div>
          </div>
        </div>

        {/* TIẾN ĐỘ ĐƠN HÀNG THẬT */}
        <div>
          <h3 style={{ margin: "0 0 25px 0", fontSize: "17px", color: "#333", fontWeight: "bold" }}>Tiến độ giao hàng của đơn</h3>
          {loading ? (
            <p style={{ color: "#888" }}>Đang quét kiểm tra lộ trình đơn hàng thật...</p>
          ) : orders.length === 0 ? (
            <div style={{ border: "1px dashed #ccc", padding: "40px", textAlign: "center", color: "#999", borderRadius: "8px" }}>Bạn chưa có đơn hàng thật nào.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "35px" }}>
              {orders.map((order) => {
                const currentStep = getStepIndex(order.trang_thai);
                const itemChiTiet = order.chi_tiet || order.don_hang_chi_tiet || [];
                const dHangId = order.id || order.don_hang_id;

                return (
                  <div key={order.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "25px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px", fontSize: "13px" }}>
                      <span>Mã đơn: <strong style={{ color: "#1c3f3a" }}>#DH{dHangId}</strong></span>
                      <span style={{ fontWeight: "bold", color: order.trang_thai === "huy" ? "#e74c3c" : "#2ecc71" }}>
                        {order.trang_thai === "huy" ? "ĐỀN BÙ / ĐÃ HỦY" : `TRẠNG THÁI: ${order.trang_thai.toUpperCase()}`}
                      </span>
                    </div>

                    <div style={{ marginBottom: "25px", display: "flex", flexDirection: "column", gap: "15px" }}>
                      {itemChiTiet.map((item, idx) => {
                        const exactTranhId = item.tranh?.id || item.tranh_id;

                        return (
                          <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: idx < itemChiTiet.length - 1 ? "1px dashed #f1f5f9" : "none", paddingBottom: "10px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                              <div style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}>{item.tranh?.ten_tranh || "Tác phẩm nghệ thuật"}</div>
                              <small style={{ color: "#888" }}>x{item.so_luong} kiện</small>
                            </div>

                            {order.trang_thai === "hoan_thanh" && exactTranhId && (
                              <button 
                                onClick={() => navigate(`/danh-gia-tranh/${dHangId}/${exactTranhId}`)} 
                                style={{ backgroundColor: "#1c3f3a", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "4px", fontWeight: "bold", cursor: "pointer", fontSize: "12px" }}
                              >
                                ⭐ Viết Đánh Giá
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {order.trang_thai !== "huy" && (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", padding: "10px 0 10px 0" }}>
                        {milestones.map((m, idx) => {
                          const isDone = idx <= currentStep;
                          return (
                            <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, position: "relative", zIndex: 2 }}>
                              <div style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: isDone ? "#2ecc71" : "#e2e8f0", color: isDone ? "#fff" : "#718096", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "bold", border: "3px solid #fff" }}>
                                {idx + 1}
                              </div>
                              <span style={{ position: "absolute", bottom: "-32px", width: "95px", textAlign: "center", fontSize: "10.5px", color: isDone ? "#27ae60" : "#a0aec0", fontWeight: isDone ? "600" : "normal" }}>
                                {m.label}
                              </span>
                              {idx < milestones.length - 1 && (
                                <div style={{ position: "absolute", left: "50%", top: "15px", width: "100%", height: "4px", backgroundColor: idx < currentStep ? "#2ecc71" : "#e2e8f0", zIndex: -1 }} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Profile;