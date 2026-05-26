const router = require("express").Router();

const {
  taoVanDon,
  layTatCaVanDon,
  layChiTietVanDon,
  capNhatTrangThaiVanDon,
  capNhatVanDon,
  xoaVanDon,
} = require("../controllers/vanDon.controller");

const {
  yeuCauDangNhap,
  yeuCauNhanVien,
  kiemTraVaiTro,
} = require("../utils/middleware");

router.use(yeuCauDangNhap);
router.use(yeuCauNhanVien);

router.post("/don-hang/:don_hang_id", taoVanDon);
router.get("/", layTatCaVanDon);
router.get("/:id", layChiTietVanDon);
router.put("/:id", capNhatVanDon);
router.patch("/:id/trang-thai", capNhatTrangThaiVanDon);
router.delete("/:id", kiemTraVaiTro("quan_ly"), xoaVanDon);

module.exports = router;
