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

// ========== CÔNG KHAI: Xem đánh giá ==========
router.get("/tranh/:tranhId", xemDanhGiaTheoTranh);

// ========== KHÁCH HÀNG: Quản lý đánh giá của mình ==========
router.use(yeuCauDangNhap);
router.post("/", yeuCauKhachHang, taoDanhGia);
router.get("/cua-toi", yeuCauKhachHang, xemDanhGiaCuaToi);

// ========== QUẢN LÝ: Quản lý tất cả đánh giá ==========
router.use(kiemTraVaiTro("quan_ly"));
router.get("/", adminXemTatCaDanhGia);
router.patch("/:id/trang-thai", adminCapNhatTrangThaiDanhGia);
router.patch("/:id/phan-hoi", adminPhanHoiDanhGia);

module.exports = router;
