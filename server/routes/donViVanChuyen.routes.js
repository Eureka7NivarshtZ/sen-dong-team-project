const express = require("express");
const router = express.Router();

const {
  layDonViVanChuyenHoatDong,
  layTatCaDonViVanChuyen,
  layChiTietDonViVanChuyen,
  themDonViVanChuyen,
  capNhatDonViVanChuyen,
  xoaDonViVanChuyen,
  khoaMoDonViVanChuyen,
} = require("../controllers/donViVanChuyen.controller");

const {
  yeuCauDangNhap,
  kiemTraVaiTro,
  yeuCauNhanVien,
} = require("../utils/middleware");

// ========== CÔNG KHAI: Xem đơn vị vận chuyển hoạt động ==========
router.get("/hoat-dong", layDonViVanChuyenHoatDong);

// ========== NHÂN VIÊN: Xem đơn vị vận chuyển ==========
router.use(yeuCauDangNhap);
router.use(yeuCauNhanVien);
router.get("/", layTatCaDonViVanChuyen);
router.get("/:id", layChiTietDonViVanChuyen);

// ========== QUẢN LÝCTẨN: Quản lý đơn vị vận chuyển ==========
router.use(kiemTraVaiTro("quan_ly"));
router.post("/", themDonViVanChuyen);
router.put("/:id", capNhatDonViVanChuyen);
router.delete("/:id", xoaDonViVanChuyen);
router.put("/:id/khoa-mo", khoaMoDonViVanChuyen);

module.exports = router;
