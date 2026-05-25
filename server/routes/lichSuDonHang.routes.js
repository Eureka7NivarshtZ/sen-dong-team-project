const express = require("express");
const router = express.Router();

const {
  xemLichSuTrangThaiDonHang,
} = require("../controllers/lichSuDonHang.controller");
const { yeuCauDangNhap } = require("../utils/middleware");

router.get(
  "/:donHangId/lich-su-trang-thai",
  yeuCauDangNhap,
  xemLichSuTrangThaiDonHang,
);

module.exports = router;
