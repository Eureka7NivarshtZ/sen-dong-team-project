const router = require("express").Router();

const {
  taoDonHang,
  xemDonCuaToi,
  xemChiTietDonCuaToi,
  huyDonCuaToi,
} = require("../controllers/donHang.controller");

const { yeuCauDangNhap, yeuCauKhachHang } = require("../utils/middleware");

router.use(yeuCauDangNhap);
router.use(yeuCauKhachHang);

router.post("/them", taoDonHang);
router.get("/cua-toi", xemDonCuaToi);
router.get("/:id", xemChiTietDonCuaToi);
router.put("/:id/huy", huyDonCuaToi);

module.exports = router;
