const router = require("express").Router();

const {
  taoHoaDon,
  layTatCaHoaDon,
  layChiTietHoaDon,
  huyHoaDon,
} = require("../controllers/hoaDon.controller");

const {
  yeuCauDangNhap,
  kiemTraVaiTro,
  yeuCauNhanVien,
} = require("../utils/middleware");

router.use(yeuCauDangNhap);

router.get("/:id", layChiTietHoaDon);

router.use(yeuCauNhanVien);

router.get("/", layTatCaHoaDon);
router.post("/", taoHoaDon);

router.put("/:id/huy", kiemTraVaiTro("quan_ly"), huyHoaDon);

module.exports = router;
