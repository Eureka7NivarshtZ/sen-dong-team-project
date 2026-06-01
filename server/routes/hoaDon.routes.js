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

// Khách hàng: xem chi tiết hóa đơn của mình
router.get("/:id", yeuCauDangNhap, layChiTietHoaDon);

// Khách hàng: tạo hóa đơn sau khi đặt hàng
router.post("/", yeuCauDangNhap, taoHoaDon);

// Nhân viên trở lên: xem tất cả hóa đơn
router.get("/", yeuCauDangNhap, yeuCauNhanVien, layTatCaHoaDon);

// Quản lý: hủy hóa đơn
router.put("/:id/huy", yeuCauDangNhap, kiemTraVaiTro("quan_ly"), huyHoaDon);

module.exports = router;
