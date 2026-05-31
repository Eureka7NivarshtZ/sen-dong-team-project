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

// Chỉ yêu cầu đăng nhập cho tất cả
router.use(yeuCauDangNhap);

router.post("/", taoThanhToan);
router.get("/:id", layChiTietThanhToan);

// ========== NHÂN VIÊN: Xem và tạo thanh toán ==========
router.use(yeuCauNhanVien);
router.get("/", layTatCaThanhToan);

// ========== QUẢN LÝ / BAN HÀNG: Cập nhật trạng thái thanh toán ==========
router.put(
  "/:id/trang-thai",
  kiemTraVaiTro(["quan_ly", "ban_hang"]),
  capNhatTrangThaiThanhToan,
);

module.exports = router;
