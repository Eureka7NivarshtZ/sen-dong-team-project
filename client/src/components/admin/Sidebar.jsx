import React from "react";

function Sidebar({ onNavigate, currentTab }) {
  // Hàm xử lý khi bấm nút Đăng xuất
  const handleLogout = () => {
    localStorage.clear(); // Xóa sạch dữ liệu tài khoản đăng nhập
    alert("Đã đăng xuất tài khoản quản trị thành công!");
    onNavigate("home"); // Buộc quay về trang chủ giao diện khách hàng
  };

  // Hàm tạo Style làm nổi bật Menu đang được chọn
  const getBtnStyle = (tabName) => ({
    background: currentTab === tabName ? "rgba(255, 255, 255, 0.2)" : "none",
    border: "none",
    color: "#ffffff",
    textAlign: "left",
    padding: "12px 15px",
    fontSize: "15px",
    cursor: "pointer",
    width: "100%",
    borderRadius: "6px",
    display: "block",
    fontWeight: currentTab === tabName ? "bold" : "normal",
    transition: "background 0.2s",
  });

  return (
    <div className="sidebar" style={{ width: "260px", backgroundColor: "#1c3f3a", color: "#ffffff", minHeight: "100vh", padding: "30px 20px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "sticky", top: 0, height: "100vh" }}>
      <div>
        {/* LOGO - Bấm vào quay về trang chủ Client */}
        <div className="logo" style={{ marginBottom: "35px", cursor: "pointer" }} onClick={() => onNavigate("home")}>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "bold", letterSpacing: "1px" }}>SEN ĐÔNG</h2>
          <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#a3b8b5" }}>Art Studio Admin</p>
        </div>

        {/* DANH SÁCH MENU ĐIỀU HƯỚNG */}
        <div className="menu" style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
          <p className="menu-title" style={{ color: "#a3b8b5", margin: "0 0 10px 0", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>Chính</p>

          <button onClick={() => onNavigate("admin-dashboard")} style={getBtnStyle("admin-dashboard")}>📊 Tổng quan</button>
          <button onClick={() => onNavigate("admin-orders")} style={getBtnStyle("admin-orders")}>📦 Đơn hàng</button>
          <button onClick={() => onNavigate("admin-paintings")} style={getBtnStyle("admin-paintings")}>🎨 Quản lý tranh</button>
          <button onClick={() => onNavigate("admin-warehouse")} style={getBtnStyle("admin-warehouse")}>🏢 Kho hàng</button>
          <button onClick={() => onNavigate("admin-employees")} style={getBtnStyle("admin-employees")}>👥 Nhân viên</button>
        </div>
      </div>

      {/* NÚT ĐĂNG XUẤT */}
      <button 
        onClick={handleLogout} 
        style={{ width: "100%", padding: "12px", backgroundColor: "#e74c3c", color: "#ffffff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "14px", transition: "background 0.2s" }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#c0392b"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#e74c3c"}
      >
        🚪 Đăng xuất
      </button>
    </div>
  );
}

export default Sidebar;