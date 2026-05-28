const router = require("express").Router();

const {
  xemTatCaKhachHang,
  xemChiTietKhachHang,
  khoa_KhachHang,
} = require("../controllers/khachHang.controller");

const {
  yeuCauDangNhap,
  kiemTraVaiTro,
  yeuCauNhanVien,
} = require("../utils/middleware");

// ========== NHÂN VIÊN / QUẢN LÝ: Xem khách hàng ==========
router.use(yeuCauDangNhap);
router.use(yeuCauNhanVien);
router.get("/", xemTatCaKhachHang);
router.get("/:id", xemChiTietKhachHang);

// ========== QUẢN LÝ: Khóa khách hàng ==========
router.put("/:id/khoa", kiemTraVaiTro("quan_ly"), khoa_KhachHang);

module.exports = router;
