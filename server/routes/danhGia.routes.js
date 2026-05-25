const express = require("express");
const router = express.Router();

const {
  xemDanhGiaTheoTranh,
  taoDanhGia,
  xemDanhGiaCuaToi,
} = require("../controllers/danhGia.controller");

const { yeuCauDangNhap } = require("../utils/middleware");

router.get("/tranh/:tranhId/danh-gia", xemDanhGiaTheoTranh);
router.post("/", yeuCauDangNhap, taoDanhGia);
router.get("/cua-toi", yeuCauDangNhap, xemDanhGiaCuaToi);

module.exports = router;
