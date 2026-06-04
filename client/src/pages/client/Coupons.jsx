import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";

function Coupons() {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Gọi API thực tế nạp dữ liệu từ SQL Server
  useEffect(() => {
    const fetchRealCoupons = async () => {
      try {
        // Gửi kèm tham số lọc trang_thai để Backend bốc đúng các mã đang chạy
        const response = await apiClient.get("/khuyen-mai", {
          params: { trang_thai: "hoat_dong" }
        });
        
        if (response.data && response.data.success) {
          setCoupons(response.data.data || []);
        } else {
          setError(response.data?.error || "Không thể lấy danh sách ưu đãi.");
        }
      } catch (err) {
        console.error("Lỗi kết nối API khuyến mãi:", err);
        setError("Không thể kết nối đến máy chủ dữ liệu khuyến mãi.");
      } finally {
        setLoading(false);
      }
    };

    fetchRealCoupons();
  }, []);

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    alert(`🎉 Đã sao chép mã [ ${code} ] thành công!`);
  };

  if (loading) {
    return <div style={{ padding: "80px", textAlign: "center", fontFamily: "Arial" }}>Đang quét kho mã giảm giá thời gian thực...</div>;
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px", fontFamily: "Arial, sans-serif", textAlign: "left" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h2 style={{ color: "#1c3f3a", fontSize: "30px", fontWeight: "bold" }}>🎟️ Kho Ưu Đãi Xưởng Tranh Sen Đông</h2>
        <p style={{ color: "#666" }}>Áp dụng các mã khuyến mãi thực tế dưới đây tại bước thanh toán giỏ hàng</p>
        {error && <p style={{ color: "#e74c3c", marginTop: "10px", fontWeight: "600" }}>⚠ {error}</p>}
      </div>

      {coupons.length === 0 ? (
        <div style={{ textAlign: "center", color: "#888", padding: "40px", border: "1px dashed #ccc", borderRadius: "8px" }}>
          Hiện tại xưởng chưa kích hoạt chương trình khuyến mãi nào khả dụng.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "25px" }}>
          {coupons.map((coupon) => {
            // Khớp nối chính xác 100% các trường dữ liệu từ Sequelize Model của ông
            const code = coupon.ma;
            const title = coupon.ten;
            const description = coupon.mo_ta || "Ưu đãi giảm giá trực tiếp cho đơn hàng đặt tại xưởng.";
            const minCondition = Number(coupon.don_toi_thieu || 0);
            const valueGiam = Number(coupon.gia_tri_giam || 0);
            const maxGiam = coupon.giam_toi_da ? Number(coupon.giam_toi_da) : null;

            // Xử lý chuỗi hiển thị số tiền giảm dựa trên loại giảm (phan_tram / so_tien)
            const textHienThiGiam = coupon.loai_giam === "phan_tram"
              ? `Giảm ${valueGiam}%` + (maxGiam ? ` (Tối đa ${maxGiam.toLocaleString("vi-VN")}đ)` : "")
              : `Giảm trực tiếp ${valueGiam.toLocaleString("vi-VN")}đ`;

            return (
              <div key={coupon.id} style={{ display: "flex", border: "1px dashed #1c3f3a", borderRadius: "10px", backgroundColor: "#fff", overflow: "hidden", boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
                
                {/* VÙNG TRÁI: MÃ CODE */}
                <div style={{ width: "140px", backgroundColor: "#1c3f3a", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "15px", textAlign: "center", borderRight: "2px dashed #f4f6f5" }}>
                  <span style={{ fontSize: "11px", opacity: 0.8, marginBottom: "5px" }}>CODE</span>
                  <strong style={{ fontSize: "14px", letterSpacing: "1px", backgroundColor: "rgba(255,255,255,0.2)", padding: "4px 8px", borderRadius: "4px", wordBreak: "break-all" }}>
                    {code}
                  </strong>
                </div>

                {/* VÙNG PHẢI: NỘI DUNG CHI TIẾT */}
                <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ margin: "0 0 6px 0", color: "#1c3f3a", fontSize: "17px", fontWeight: "bold" }}>
                      {title} <span style={{ color: "#2e7d32", fontSize: "14px", display: "block", marginTop: "4px" }}>({textHienThiGiam})</span>
                    </h3>
                    <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#555", lineHeight: "1.4" }}>{description}</p>
                    <small style={{ color: "#e67e22", fontWeight: "600", fontSize: "12px" }}>
                      ⚠️ Điều kiện: {minCondition > 0 ? `Đơn từ ${minCondition.toLocaleString("vi-VN")} đ` : "Mọi đơn hàng"}
                    </small>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "15px" }}>
                    <button onClick={() => handleCopyCode(code)} style={{ backgroundColor: "#1c3f3a", color: "white", border: "none", padding: "8px 16px", borderRadius: "4px", fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}>
                      Sao Chép Mã
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <button onClick={() => navigate("/gio-hang")} style={{ backgroundColor: "#333", color: "white", padding: "12px 30px", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>
          ← Quay lại giỏ hàng để áp dụng mã
        </button>
      </div>
    </div>
  );
}

export default Coupons;