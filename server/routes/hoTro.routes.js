const express = require("express");
const router = express.Router();

const {
  taoYeuCauHoTro,
  xemYeuCauHoTroCuaToi,
  xemChiTietYeuCauHoTro,
  khachHangPhanHoiHoTro,
} = require("../controllers/hoTro.controller");

const { yeuCauDangNhap } = require("../utils/middleware");

router.use(yeuCauDangNhap);

router.post("/", taoYeuCauHoTro);
router.get("/cua-toi", xemYeuCauHoTroCuaToi);
router.get("/:id", xemChiTietYeuCauHoTro);
router.post("/:id/phan-hoi", khachHangPhanHoiHoTro);

module.exports = router;
