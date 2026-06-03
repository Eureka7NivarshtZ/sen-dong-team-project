import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 🌟 ĐÃ THÊM: Công cụ kích hoạt điều hướng tuyến đường
import { dashboardService } from "../../services";

function Dashboard() {
  const navigate = useNavigate(); // 🌟 ĐÃ THÊM: Khởi tạo hàm chuyển trang
  
  const [stats, setStats] = useState({
    tong_tranh: 0,
    tong_khach_hang: 0,
    tong_don_hang: 0,
    don_cho_xac_nhan: 0,
    tong_doanh_thu: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllDashboardData = async () => {
    try {
      const [statsRes, ordersRes, revenueRes] = await Promise.all([
        dashboardService.layDashboardTongQuan(),
        dashboardService.layDonHangGanDay(),
        dashboardService.layDoanhThuTheoThang(),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (ordersRes.success) setRecentOrders(ordersRes.data || []);
      if (revenueRes.success) setRevenueData(revenueRes.data || []);
    } catch (error) {
      console.error("Lỗi nạp dữ liệu thống kê:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDashboardData();
  }, []);

  if (loading) {
    return <div style={{ padding: "30px", fontFamily: "Arial" }}>Đang tải số liệu từ SQL Server...</div>;
  }

  const maxRevenue = Math.max(...revenueData.map((item) => item.doanh_thu), 1);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif", backgroundColor: "#f4f6f5", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "25px", color: "#1c3f3a", fontWeight: "bold", fontSize: "24px" }}>Tổng quan</h2>

      {/* 1. CỤM 3 THẺ SỐ LIỆU */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "30px" }}>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Doanh thu theo tháng</div>
          <div style={{ ...cardValueStyle, color: "#1c3f3a" }}>
            {stats.tong_doanh_thu?.toLocaleString("vi-VN")} ₫
          </div>
          <div style={{ ...cardSubStyle, color: "#2e7d32" }}>▲ 8.5% Up from yesterday</div>
        </div>

        <div style={cardStyle}>
          <div style={cardLabelStyle}>Đơn hàng hôm nay</div>
          <div style={{ ...cardValueStyle, color: "#1c3f3a" }}>
            {stats.tong_don_hang} <span style={{ fontSize: "16px", color: "#888" }}>đơn</span>
          </div>
          <div style={{ ...cardSubStyle, color: "#2e7d32" }}>▲ 1.3% Up from past week</div>
        </div>

        <div style={cardStyle}>
          <div style={cardLabelStyle}>Tranh đang bán</div>
          <div style={{ ...cardValueStyle, color: "#1c3f3a" }}>
            {stats.tong_tranh} <span style={{ fontSize: "16px", color: "#888" }}>tác phẩm</span>
          </div>
          <div style={{ ...cardSubStyle, color: "#d32f2f" }}>▼ 4.3% Down from yesterday</div>
        </div>
      </div>

      {/* 2. ĐỒ THỊ VÀ BẢNG DANH SÁCH CHI TIẾT */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "25px" }}>
        
        {/* BIỂU ĐỒ DOANH THU */}
        <div style={sectionBoxStyle}>
          <h3 style={sectionTitleStyle}>Doanh thu 6 tháng gần đây</h3>
          <div style={chartContainerStyle}>
            {revenueData.slice(0, 6).map((item) => {
              const barHeightPercentage = (item.doanh_thu / maxRevenue) * 100;
              return (
                <div key={item.thang} style={chartColumnWrapperStyle}>
                  <div style={chartTooltipStyle}>
                    {item.doanh_thu > 0 ? `${(item.doanh_thu / 1000000).toFixed(1)}M` : "0"}
                  </div>
                  <div 
                    style={{ 
                      ...chartBarStyle, 
                      height: `${Math.max(barHeightPercentage, 5)}%`,
                      backgroundColor: item.doanh_thu > 0 ? "#1c3f3a" : "#e0e0e0"
                    }} 
                  />
                  <div style={chartLabelMonthStyle}>T{item.thang}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BẢNG ĐƠN HÀNG MỚI NHẤT */}
        <div style={sectionBoxStyle}>
          <h3 style={sectionTitleStyle}>Đơn hàng mới</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #eee", backgroundColor: "#f8f9fa" }}>
                  <th style={thStyle}>Mã đơn</th>
                  <th style={thStyle}>Khách hàng</th>
                  <th style={thStyle}>Địa chỉ</th>
                  <th style={thStyle}>Trạng thái</th>
                  <th style={thStyle}>Ngày đặt</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Hoạt động</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ ...tdStyle, textAlign: "center", color: "#999", fontStyle: "italic" }}>
                      Hệ thống chưa có lịch sử đơn hàng.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: "1px solid #f1f1f1" }}>
                      <td style={{ ...tdStyle, fontWeight: "bold", color: "#1c3f3a" }}>
                        {order.id?.toString().padStart(5, "0") || order.id}
                      </td>
                      <td style={tdStyle}>
                        {order.khach_hang?.ho_ten || order.khach_hang?.ten || "Khách vãng lai"}
                      </td>
                      <td style={{ ...tdStyle, maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {order.dia_chi_giao_hang || order.dia_chi || "Tại xưởng"}
                      </td>
                      <td style={tdStyle}>
                        <span style={getStatusBadgeStyle(order.trang_thai)}>
                          {order.trang_thai === "da_tra_loi" || order.trang_thai === "Hoàn thành" ? "Hoàn thành" : "Đang xử lý"}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        {order.ngay_dat ? new Date(order.ngay_dat).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "N/A"}
                      </td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        {/* 🌟 ĐÃ SỬA: Gắn lệnh nhảy trang. Ông kiểm tra xem route đơn hàng của team đặt là '/admin/don-hang' hay '/admin/orders' để sửa chữ trong dấu nháy cho khớp nhé */}
                        <button 
                          onClick={() => navigate(`/admin/don-hang`)} 
                          style={{ backgroundColor: "#1c3f3a", color: "white", border: "none", padding: "4px 12px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}
                        >
                          Xem
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

// === STYLE OBJECTS ===
const cardStyle = { padding: "24px 20px", border: "1px solid #e2e8f0", borderRadius: "8px", backgroundColor: "#ffffff", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" };
const cardLabelStyle = { fontSize: "14px", color: "#718096", marginBottom: "10px", fontWeight: "500" };
const cardValueStyle = { fontSize: "28px", fontWeight: "bold", marginBottom: "8px" };
const cardSubStyle = { fontSize: "12px", fontWeight: "600" };
const sectionBoxStyle = { backgroundColor: "#ffffff", padding: "24px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" };
const sectionTitleStyle = { margin: "0 0 20px 0", fontSize: "16px", color: "#1c3f3a", fontWeight: "bold" };
const thStyle = { padding: "12px 16px", color: "#4a5568", fontSize: "13px", fontWeight: "600" };
const tdStyle = { padding: "14px 16px", fontSize: "13px", color: "#2d3748" };
const chartContainerStyle = { display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: "220px", paddingTop: "20px" };
const chartColumnWrapperStyle = { display: "flex", flexDirection: "column", alignItems: "center", flex: 1, height: "100%", position: "relative" };
const chartBarStyle = { width: "20px", borderRadius: "4px 4px 0 0", transition: "all 0.3s ease" };
const chartLabelMonthStyle = { marginTop: "8px", fontSize: "12px", color: "#718096", fontWeight: "500" };
const chartTooltipStyle = { fontSize: "10px", color: "#718096", marginBottom: "4px", fontWeight: "bold" };

const getStatusBadgeStyle = (status) => {
  let bg = "#e8f5e9", color = "#2e7d32";
  if (status === "cho_xac_nhan" || status === "dang_xu_ly" || status === "Đang xử lý") { bg = "#fff3e0"; color = "#e67e22"; }
  if (status === "bi_huy" || status === "da_huy") { bg = "#ffebee"; color = "#c62828"; }
  return { padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold", backgroundColor: bg, color: color, display: "inline-block" };
};

export default Dashboard;