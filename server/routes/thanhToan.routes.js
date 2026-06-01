const router = require("express").Router();

const {
  taoThanhToan,
  layTatCaThanhToan,
  layChiTietThanhToan,
  capNhatTrangThaiThanhToan,
} = require("../controllers/thanhToan.controller");

const {
  yeuCauDangNhap,
  kiemTraVaiTro,
  yeuCauNhanVien,
} = require("../utils/middleware");

// ========== TẤT CẢ (đã đăng nhập): Tạo thanh toán ==========
router.post("/them", yeuCauDangNhap, taoThanhToan);

// ========== TẤT CẢ (đã đăng nhập): Xem chi tiết thanh toán ==========
router.get("/:id", yeuCauDangNhap, layChiTietThanhToan);

// ========== NHÂN VIÊN: Xem danh sách tất cả thanh toán ==========
router.get("/", yeuCauDangNhap, yeuCauNhanVien, layTatCaThanhToan);

// ========== QUẢN LÝ / BAN HÀNG: Cập nhật trạng thái thanh toán ==========
router.put(
  "/:id/trang-thai",
  yeuCauDangNhap,
  kiemTraVaiTro(["quan_ly", "ban_hang"]),
  capNhatTrangThaiThanhToan,
);

module.exports = router;
