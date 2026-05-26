const router = require("express").Router();

const {
  xemTatCaDonHang,
  xemChiTietDonBatKy,
  capNhatTrangThaiDon,
  huyDonBatKy,
  taoDonHang,
  xemDonCuaToi,
  xemChiTietDonCuaToi,
  huyDonCuaToi,
} = require("../controllers/donHang.controller");

const {
  yeuCauDangNhap,
  yeuCauKhachHang,
  yeuCauNhanVien,
} = require("../utils/middleware");

router.use(yeuCauDangNhap);

router.post("/", yeuCauKhachHang, taoDonHang);
router.get("/cua-toi", yeuCauKhachHang, xemDonCuaToi);
router.get("/:id", yeuCauKhachHang, xemChiTietDonCuaToi);
router.put("/:id/huy", yeuCauKhachHang, huyDonCuaToi);

router.use(yeuCauNhanVien);
router.get("/", xemTatCaDonHang);
router.get("/:id", xemChiTietDonBatKy);
router.put("/:id/trang-thai", capNhatTrangThaiDon);
router.put("/:id/huy", huyDonBatKy);

module.exports = router;
