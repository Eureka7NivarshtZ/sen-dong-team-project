const router = require("express").Router();

const {
  dangNhap,
  xemThongTinCuaToi,
  dangKyKhachHang,
  quenMatKhau,
  datLaiMatKhau,
} = require("../controllers/auth.controller");
const { yeuCauDangNhap } = require("../utils/middleware");

router.post("/dang-nhap", dangNhap);
router.post("/dang-ky", dangKyKhachHang);
router.post("/quen-mat-khau", quenMatKhau);
router.post("/dat-lai-mat-khau", datLaiMatKhau);

router.get("/thong-tin", yeuCauDangNhap, xemThongTinCuaToi);

module.exports = router;
