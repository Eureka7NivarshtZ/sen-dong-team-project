const express = require("express");
const router = express.Router();

const {
  xemDanhGiaTheoTranh,
  taoDanhGia,
  xemDanhGiaCuaToi,
  adminXemTatCaDanhGia,
  adminCapNhatTrangThaiDanhGia,
  adminPhanHoiDanhGia,
} = require("../controllers/danhGia.controller");

const {
  yeuCauDangNhap,
  yeuCauKhachHang,
  kiemTraVaiTro,
} = require("../utils/middleware");

router.use(yeuCauDangNhap);

router.post("/", yeuCauKhachHang, taoDanhGia);
router.get("/cua-toi", yeuCauKhachHang, xemDanhGiaCuaToi);

router.get("/tranh/:tranhId", xemDanhGiaTheoTranh);

router.get("/", kiemTraVaiTro("quan_ly"), adminXemTatCaDanhGia);
router.patch(
  "/:id/trang-thai",
  kiemTraVaiTro("quan_ly"),
  adminCapNhatTrangThaiDanhGia,
);
router.patch("/:id/phan-hoi", kiemTraVaiTro("quan_ly"), adminPhanHoiDanhGia);

module.exports = router;
