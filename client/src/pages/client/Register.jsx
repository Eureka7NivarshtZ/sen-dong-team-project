import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services";

function Register() {
  const navigate = useNavigate();
  const [ten, setTen] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authService.dangKyKhachHang(
        ten,
        email,
        password,
        soDienThoai,
        diaChi,
      );

      if (result.success) {
        alert("Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
        navigate("/login");
      } else {
        setError(result.error || "Đăng ký thất bại");
      }
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "calc(100vh - 70px)",
        backgroundColor: "#5cb384",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          width: "480px",
          borderRadius: "24px",
          padding: "50px 40px",
          boxSizing: "border-box",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            margin: "0 0 10px 0",
            color: "#111",
          }}
        >
          Đăng ký
        </h2>
        <p style={{ fontSize: "14px", color: "#666", margin: "0 0 30px 0" }}>
          Tạo tài khoản để tiếp tục
        </p>

        {error && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px",
              backgroundColor: "#fee",
              borderRadius: "8px",
              color: "#c33",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ textAlign: "left" }}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                color: "#333",
              }}
            >
              Họ tên:
            </label>
            <input
              type="text"
              placeholder="Vui lòng nhập họ tên"
              value={ten}
              onChange={(e) => setTen(e.target.value)}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 15px",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
                backgroundColor: "#f4f6f9",
                boxSizing: "border-box",
                opacity: loading ? 0.6 : 1,
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                color: "#333",
              }}
            >
              Email:
            </label>
            <input
              type="email"
              placeholder="Vui lòng nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 15px",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
                backgroundColor: "#f4f6f9",
                boxSizing: "border-box",
                opacity: loading ? 0.6 : 1,
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                color: "#333",
              }}
            >
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="Vui lòng nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 15px",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
                backgroundColor: "#f4f6f9",
                boxSizing: "border-box",
                opacity: loading ? 0.6 : 1,
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                color: "#333",
              }}
            >
              Số điện thoại (tùy chọn):
            </label>
            <input
              type="tel"
              placeholder="Vui lòng nhập số điện thoại"
              value={soDienThoai}
              onChange={(e) => setSoDienThoai(e.target.value)}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 15px",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
                backgroundColor: "#f4f6f9",
                boxSizing: "border-box",
                opacity: loading ? 0.6 : 1,
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                color: "#333",
              }}
            >
              Địa chỉ (tùy chọn):
            </label>
            <input
              type="text"
              placeholder="Vui lòng nhập địa chỉ"
              value={diaChi}
              onChange={(e) => setDiaChi(e.target.value)}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 15px",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
                backgroundColor: "#f4f6f9",
                boxSizing: "border-box",
                opacity: loading ? 0.6 : 1,
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "30px",
            }}
          >
            <input
              type="checkbox"
              id="terms"
              defaultChecked
              required
              disabled={loading}
              style={{ cursor: "pointer", opacity: loading ? 0.6 : 1 }}
            />
            <label
              htmlFor="terms"
              style={{
                fontSize: "13px",
                color: "#666",
                cursor: "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              Tôi đồng ý với các điều khoản
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: loading ? "#aaa" : "#5cb384",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <p
          style={{
            fontSize: "14px",
            color: "#555",
            marginTop: "25px",
            marginBottom: 0,
          }}
        >
          Đã có tài khoản ?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
            style={{
              color: "#2f80ed",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
