import { FiBell, FiUser } from "react-icons/fi";

function Topbar() {
  // Tự động lấy tên tài khoản từ localStorage, nếu chưa đăng nhập thì hiện tên mặc định của Khang
  const storedUser = localStorage.getItem("user");
  const currentAdmin = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div
      className="topbar"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #f0f0f0",
        height: "60px",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: "18px",
          color: "#333333",
          fontWeight: "600",
        }}
      >
        Hệ thống quản trị xưởng tranh
      </h2>

      <div
        className="topbar-icons"
        style={{ display: "flex", alignItems: "center", gap: "20px" }}
      >
        {/* Nút chuông thông báo */}
        <div
          className="notification"
          style={{
            position: "relative",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <FiBell size={22} color="#555555" />
          <span
            className="notification-dot"
            style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              width: "8px",
              height: "8px",
              backgroundColor: "#e74c3c",
              borderRadius: "50%",
            }}
          ></span>
        </div>

        {/* Hiển thị tên tài khoản */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FiUser size={22} color="#1c3f3a" />
          <span
            style={{ fontSize: "14px", fontWeight: "600", color: "#1c3f3a" }}
          >
            {currentAdmin?.ho_ten || "Admin"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
