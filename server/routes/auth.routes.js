const router = require("express").Router();

const {
  dangNhap,
  xemThongTinCuaToi,
} = require("../controllers/auth.controller");
const { yeuCauDangNhap } = require("../utils/middleware");

router.post("/dang-nhap", dangNhap);
router.get("/thong-tin", yeuCauDangNhap, xemThongTinCuaToi);

module.exports = router;
