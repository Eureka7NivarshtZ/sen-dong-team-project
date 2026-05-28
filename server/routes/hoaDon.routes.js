const router = require("express").Router();

const {
  taoHoaDon,
  layTatCaHoaDon,
  layChiTietHoaDon,
  huyHoaDon,
} = require("../controllers/hoaDon.controller");

const {
  yeuCauDangNhap,
  kiemTraVaiTro,
  yeuCauNhanVien,
} = require("../utils/middleware");

// ========== TẤT CẢ: Xem chi tiết hóa đơn ==========
router.get("/:id", yeuCauDangNhap, layChiTietHoaDon);

// ========== NHÂN VIÊN: Quản lý hóa đơn ==========
router.use(yeuCauDangNhap);
router.use(yeuCauNhanVien);

router.get("/", layTatCaHoaDon);
router.post("/", taoHoaDon);

router.put("/:id/huy", kiemTraVaiTro("quan_ly"), huyHoaDon);

module.exports = router;
