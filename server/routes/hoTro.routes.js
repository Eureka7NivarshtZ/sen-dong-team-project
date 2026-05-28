const express = require("express");
const router = express.Router();

const {
  taoYeuCauHoTro,
  xemYeuCauHoTroCuaToi,
  xemChiTietYeuCauHoTro,
  khachHangPhanHoiHoTro,
  adminXemTatCaYeuCauHoTro,
  adminCapNhatYeuCauHoTro,
  adminPhanHoiHoTro,
} = require("../controllers/hoTro.controller");

const {
  yeuCauDangNhap,
  yeuCauKhachHang,
  yeuCauNhanVien,
} = require("../utils/middleware");

router.use(yeuCauDangNhap);

// ========== KHÁCH HÀNG: Quản lý yêu cầu hỗ trợ của mình ==========
router.post("/", yeuCauKhachHang, taoYeuCauHoTro);
router.get("/cua-toi", yeuCauKhachHang, xemYeuCauHoTroCuaToi);
router.get("/chi-tiet/:id", yeuCauKhachHang, xemChiTietYeuCauHoTro);
router.post("/phan-hoi/:id", yeuCauKhachHang, khachHangPhanHoiHoTro);

// ========== NHÂN VIÊN: Quản lý tất cả yêu cầu hỗ trợ ==========
router.use(yeuCauNhanVien);
router.get("/", adminXemTatCaYeuCauHoTro);
router.patch("/:id", adminCapNhatYeuCauHoTro);
router.post("/:id/phan-hoi", adminPhanHoiHoTro);

module.exports = router;
