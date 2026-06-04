import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUserLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authService.dangNhap(email, password);

      if (result.success) {
        const user = authService.getUser();
        const isAdmin =
          user?.loai === "nhan_vien" ||
          user?.vai_tro === "quan_ly" ||
          user?.vai_tro === "nhan_vien";
        if (isAdmin) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setError(result.error || "Tài khoản hoặc mật khẩu không chính xác");
      }
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
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
          Đăng nhập
        </h2>
        <p style={{ fontSize: "14px", color: "#666", margin: "0 0 30px 0" }}>
          Vui lòng nhập email và mật khẩu để tiếp tục
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

        <form style={{ textAlign: "left" }}>
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

          <div style={{ marginBottom: "15px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <label style={{ fontSize: "14px", color: "#333" }}>
                Mật Khẩu:
              </label>
            </div>
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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "25px",
            }}
          >
            <input
              type="checkbox"
              id="remember"
              defaultChecked
              disabled={loading}
              style={{ cursor: "pointer", opacity: loading ? 0.6 : 1 }}
            />
            <label
              htmlFor="remember"
              style={{
                fontSize: "13px",
                color: "#666",
                cursor: "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              Nhớ mật khẩu
            </label>
          </div>

          <button
            type="button"
            onClick={handleUserLogin}
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
              marginBottom: "12px",
              transition: "background 0.2s",
            }}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
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
          Chưa có tài khoản?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/auth/dang-ky");
            }}
            style={{
              color: "#2f80ed",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Tạo tài khoản
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
