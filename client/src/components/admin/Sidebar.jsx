import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hàm xử lý khi bấm nút Đăng xuất
  const handleLogout = () => {
    localStorage.clear(); // Xóa sạch dữ liệu tài khoản đăng nhập
    alert("Đã đăng xuất tài khoản quản trị thành công!");
    navigate("/"); // Quay về trang chủ giao diện khách hàng
  };

  // Hàm kiểm tra xem route hiện tại có match không
  const isActive = (path) => {
    return location.pathname === path || location.pathname === `/admin${path}`;
  };

  // Hàm tạo Style làm nổi bật Menu đang được chọn
  const getBtnStyle = (path) => ({
    background: isActive(path) ? "rgba(255, 255, 255, 0.2)" : "none",
    border: "none",
    color: "#ffffff",
    textAlign: "left",
    padding: "12px 15px",
    fontSize: "15px",
    cursor: "pointer",
    width: "100%",
    borderRadius: "6px",
    display: "block",
    fontWeight: isActive(path) ? "bold" : "normal",
    transition: "background 0.2s",
  });

  return (
    <div className="sidebar" style={{ width: "260px", backgroundColor: "#1c3f3a", color: "#ffffff", minHeight: "100vh", padding: "30px 20px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "sticky", top: 0, height: "100vh" }}>
      <div>
        {/* LOGO - Bấm vào quay về trang chủ Client */}
        <div className="logo" style={{ marginBottom: "35px", cursor: "pointer" }} onClick={() => navigate("/")}>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "bold", letterSpacing: "1px" }}>SEN ĐÔNG</h2>
          <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#a3b8b5" }}>Art Studio Admin</p>
        </div>

        {/* DANH SÁCH MENU ĐIỀU HƯỚNG */}
        <div className="menu" style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
          <p className="menu-title" style={{ color: "#a3b8b5", margin: "0 0 10px 0", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>Chính</p>

          <button onClick={() => navigate("/admin")} style={getBtnStyle("/admin")}>📊 Tổng quan</button>
          <button onClick={() => navigate("/admin/tranh")} style={getBtnStyle("/admin/tranh")}>🎨 Quản lý tranh</button>  
          <button onClick={() => navigate("/admin/tac-gia")} style={getBtnStyle("/admin/tac-gia")}>Quản lý tác giả</button>
          <button onClick={() => navigate("/admin/danh-muc")} style={getBtnStyle("/admin/danh-muc")}>Quản lý danh mục</button>
          <button onClick={() => navigate("/admin/don-hang")} style={getBtnStyle("/admin/don-hang")}>📦 Đơn hàng</button>
          <button onClick={() => navigate("/admin/kho-hang")} style={getBtnStyle("/admin/kho-hang")}>🏢 Kho hàng</button>
          <button onClick={() => navigate("/admin/nhan-vien")} style={getBtnStyle("/admin/nhan-vien")}>👥 Nhân viên</button>
          <button onClick={() => navigate("/admin/khuyen-mai")} style={getBtnStyle("/admin/khuyen-mai")}>🏷️ Khuyến mãi</button>
          <button onClick={() => navigate("/admin/ho-tro")} style={getBtnStyle("/admin/ho-tro")}>💬 Trả lời khách hàng</button>
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