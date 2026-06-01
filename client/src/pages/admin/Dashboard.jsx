import React, { useState, useEffect } from "react";
import { dashboardService } from "../../services";

function Dashboard() {
  const [stats, setStats] = useState({
    tong_doanh_thu: 0,
    tong_so_don: 0,
    tong_khach_hang: 0,
    tong_so_tranh: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await dashboardService.layDashboardTongQuan();
      if (res && res.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error("Lỗi nạp thống kê:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div style={{ padding: "30px" }}>Đang tải số liệu từ SQL Server...</div>
    );

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2 style={{ marginBottom: "30px" }}>Tổng Quan Hệ Thống</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}
      >
        <div style={cardStyle}>
          <h4>Tổng Doanh Thu</h4>
          <h2 style={{ color: "#2e7d32" }}>
            {stats.tong_doanh_thu?.toLocaleString("vi-VN")} đ
          </h2>
        </div>
        <div style={cardStyle}>
          <h4>Tổng Số Đơn Hàng</h4>
          <h2 style={{ color: "#1c3f3a" }}>{stats.tong_so_don} đơn</h2>
        </div>
        <div style={cardStyle}>
          <h4>Số Lượng Khách Hàng</h4>
          <h2 style={{ color: "#007bff" }}>
            {stats.tong_khach_hang} tài khoản
          </h2>
        </div>
        <div style={cardStyle}>
          <h4>Tổng Số Tác Phẩm Tranh</h4>
          <h2 style={{ color: "#e67e22" }}>{stats.tong_so_tranh} bức</h2>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  backgroundColor: "#fafafa",
  textAlign: "center",
};
export default Dashboard;
