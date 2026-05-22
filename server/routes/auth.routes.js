const router = require("express").Router();

const {
  dangNhap,
  xemThongTinCuaToi,
  dangKyKhachHang,
} = require("../controllers/auth.controller");
const { yeuCauDangNhap } = require("../utils/middleware");

router.post("/dang-nhap", dangNhap);
router.post('/dang-ky-khach-hang', dangKyKhachHang)
router.get("/thong-tin-cua-toi", yeuCauDangNhap, xemThongTinCuaToi);

module.exports = router;
