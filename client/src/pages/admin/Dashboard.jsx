import React from "react";
import Topbar from "../../components/admin/Topbar";
import StatCard from "../../components/admin/StatCard";      
import RevenueChart from "../../components/admin/RevenueChart";  
import OrderTable from "../../components/admin/OrderTable";

function Dashboard() {
  return (
    <div className="dashboard-content" style={{ flex: 1, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Topbar />

      <div style={{ padding: "30px", textAlign: "left" }}>
        <h1 className="dashboard-title" style={{ margin: "0 0 25px 0", fontSize: "24px", color: "#1c3f3a", fontWeight: "bold" }}>
          Tổng quan
        </h1>

        {/* CARDS THỐNG KÊ */}
        <div className="card-wrapper" style={{ display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap" }}>
          <StatCard title="Doanh thu theo tháng" value="36,000,000 đ" subtext="↑ 8.5%" />
          <StatCard title="Đơn hàng hôm nay" value="10293" subtext="↑ 1.3%" />
          <StatCard title="Tranh đang bán" value="3600" subtext="↓ 4.3%" />
          <StatCard title="Cảnh báo tồn kho" value="7" subtext="↑ 1.8%" />
        </div>

        {/* BIỂU ĐỒ DOANH THU */}
        <div style={{ marginBottom: "30px" }}>
          <RevenueChart />
        </div>

        {/* BẢNG ĐƠN HÀNG GẦN ĐÂY */}
        <div style={{ marginBottom: "30px" }}>
          <OrderTable />
        </div>

      </div>
    </div>
  );
}

export default Dashboard;