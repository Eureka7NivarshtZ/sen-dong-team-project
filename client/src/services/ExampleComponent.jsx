// Ví dụ: Component sử dụng API Services
// File: src/components/example/ExampleComponent.jsx

import React, { useState, useEffect } from "react";
import { authService, tranhService, gioHangService } from "@/services";

/**
 * Component ví dụ sử dụng các API services
 * Hiển thị cách gọi API và xử lý response
 */
function ExampleComponent() {
  const [tranh, setTranh] = useState([]);
  const [gioHang, setGioHang] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ============ Lấy danh sách tranh khi component mount ============
  useEffect(() => {
    layDanhSachTranh();

    // Nếu người dùng đã đăng nhập, lấy giỏ hàng
    if (authService.isAuthenticated()) {
      layGioHang();
    }
  }, []);

  // ============ Hàm lấy danh sách tranh ============
  const layDanhSachTranh = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await tranhService.layTatCaTranh();

      if (result.success) {
        setTranh(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi lấy dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // ============ Hàm lấy giỏ hàng ============
  const layGioHang = async () => {
    try {
      const result = await gioHangService.layGioHangCuaToi();
      if (result.success) {
        setGioHang(result.data);
      }
    } catch (err) {
      console.error("Lỗi lấy giỏ hàng:", err);
    }
  };

  // ============ Hàm thêm vào giỏ hàng ============
  const handleThemVaoGioHang = async (tranhId) => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!authService.isAuthenticated()) {
      setError("Vui lòng đăng nhập trước khi thêm vào giỏ hàng");
      // Redirect tới trang login
      return;
    }

    try {
      const result = await gioHangService.themVaoGioHang(tranhId, 1);

      if (result.success) {
        console.log("Đã thêm vào giỏ hàng");
        // Cập nhật giỏ hàng
        await layGioHang();
        // Hiển thị thông báo thành công
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  };

  // ============ Hàm xóa khỏi giỏ hàng ============
  const handleXoaKhoiGioHang = async (gioHangChiTietId) => {
    try {
      const result = await gioHangService.xoaKhoiGioHang(gioHangChiTietId);

      if (result.success) {
        // Cập nhật giỏ hàng
        await layGioHang();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi xóa khỏi giỏ hàng");
    }
  };

  // ============ Render ============
  return (
    <div className="example-component">
      <h1>Ví dụ sử dụng API Services</h1>

      {/* Hiển thị lỗi nếu có */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Đóng</button>
        </div>
      )}

      {/* Loading */}
      {loading && <p>Đang tải dữ liệu...</p>}

      {/* Danh sách tranh */}
      <section className="tranh-section">
        <h2>Danh sách tranh ({tranh.length})</h2>
        <div className="tranh-grid">
          {tranh.map((item) => (
            <div key={item.id} className="tranh-card">
              <h3>{item.ten}</h3>
              <p>Giá: {item.giaBan?.toLocaleString()} VND</p>
              <p>Số lượng: {item.soLuongTon}</p>
              <button onClick={() => handleThemVaoGioHang(item.id)}>
                Thêm vào giỏ hàng
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Giỏ hàng */}
      {gioHang && (
        <section className="gio-hang-section">
          <h2>Giỏ hàng ({gioHang.items?.length || 0})</h2>
          {gioHang.items && gioHang.items.length > 0 ? (
            <div className="gio-hang-items">
              {gioHang.items.map((item) => (
                <div key={item.id} className="gio-hang-item">
                  <p>{item.tranh?.ten}</p>
                  <p>Số lượng: {item.soLuong}</p>
                  <p>Giá: {item.tranh?.giaBan?.toLocaleString()} VND</p>
                  <button onClick={() => handleXoaKhoiGioHang(item.id)}>
                    Xóa
                  </button>
                </div>
              ))}
              <p className="total">
                Tổng tiền: {gioHang.tongTien?.toLocaleString()} VND
              </p>
            </div>
          ) : (
            <p>Giỏ hàng trống</p>
          )}
        </section>
      )}
    </div>
  );
}

export default ExampleComponent;

/**
 * ============ HƯỚNG DẪN SỬ DỤNG ============
 *
 * 1. Import services:
 *    import { authService, tranhService, gioHangService } from "@/services";
 *
 * 2. Sử dụng trong useEffect:
 *    useEffect(() => {
 *      const fetchData = async () => {
 *        const result = await tranhService.layTatCaTranh();
 *        if (result.success) {
 *          setTranh(result.data);
 *        }
 *      };
 *      fetchData();
 *    }, []);
 *
 * 3. Xử lý async actions:
 *    const handleAction = async () => {
 *      const result = await someService.someMethod();
 *      if (result.success) {
 *        // Thành công
 *      } else {
 *        // Lỗi
 *      }
 *    };
 *
 * 4. Kiểm tra authentication:
 *    if (authService.isAuthenticated()) {
 *      // Người dùng đã đăng nhập
 *    }
 */
