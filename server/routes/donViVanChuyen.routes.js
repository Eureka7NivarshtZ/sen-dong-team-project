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

router.use(yeuCauDangNhap);
router.get("/hoat-dong", layDonViVanChuyenHoatDong);

router.get("/", yeuCauNhanVien, layTatCaDonViVanChuyen);
router.get("/:id", yeuCauNhanVien, layChiTietDonViVanChuyen);

router.use(kiemTraVaiTro("quan_ly"));
router.post("/", themDonViVanChuyen);
router.put("/:id", capNhatDonViVanChuyen);
router.delete("/:id", xoaDonViVanChuyen);
router.put("/:id/khoa-mo", khoaMoDonViVanChuyen);

module.exports = router;
