const express = require("express");
const router = express.Router();

const {
  taoKhuyenMai,
  xemTatCaKhuyenMai,
  xemChiTietKhuyenMai,
  capNhatKhuyenMai,
  xoaKhuyenMai,
  kiemTraMaKhuyenMai,
} = require("../controllers/khuyenMai.controller");

const {
  yeuCauDangNhap,
  yeuCauKhachHang,
  yeuCauNhanVien,
  kiemTraVaiTro,
} = require("../utils/middleware");

// ========== KHÁCH HÀNG: Kiểm tra mã khuyến mãi ==========
router.use(yeuCauDangNhap);
router.post("/kiem-tra", yeuCauKhachHang, kiemTraMaKhuyenMai);

// ========== NHÂN VIÊN: Xem khuyến mãi ==========
router.get("/", xemTatCaKhuyenMai);
router.get("/:id", xemChiTietKhuyenMai);

// ========== QUẢN LÝ: Quản lý khuyến mãi ==========
router.use(kiemTraVaiTro("quan_ly"));
router.post("/", taoKhuyenMai);
router.put("/:id", capNhatKhuyenMai);
router.delete("/:id", xoaKhuyenMai);

module.exports = router;
