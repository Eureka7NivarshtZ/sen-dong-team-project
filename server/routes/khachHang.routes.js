const router = require("express").Router();

const {
  xemTatCaKhachHang,
  xemChiTietKhachHang,
  khoa_KhachHang,
} = require("../controllers/khachHang.controller");

const {
  yeuCauDangNhap,
  kiemTraVaiTro,
  yeuCauNhanVien,
} = require("../utils/middleware");

router.use(yeuCauDangNhap);
router.use(yeuCauNhanVien);

router.get("/", xemTatCaKhachHang);
router.get("/:id", xemChiTietKhachHang);

router.put("/:id/khoa", kiemTraVaiTro(["quan_ly"]), khoa_KhachHang);

module.exports = router;
