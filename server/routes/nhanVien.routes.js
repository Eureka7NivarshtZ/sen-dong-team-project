const router = require("express").Router();

const {
  yeuCauDangNhap,
  kiemTraVaiTro,
  yeuCauNhanVien,
} = require("../utils/middleware");

const {
  layTatCaNhanVien,
  layChiTietNhanVien,
  themNhanVien,
  capNhatNhanVien,
  khoaMoNhanVien,
  doiMatKhauNhanVien,
  xoaNhanVien,
} = require("../controllers/nhanVien.controller");

router.use(yeuCauDangNhap);
router.use(yeuCauNhanVien);

// Nhân viên / quản lý xem
router.get("/", layTatCaNhanVien);
router.get("/:id", layChiTietNhanVien);

// Chỉ quản lý được thêm, sửa, khóa/mở, xóa nhân viên
router.post("/", kiemTraVaiTro(["quan_ly"]), themNhanVien);

router.put("/:id", kiemTraVaiTro(["quan_ly"]), capNhatNhanVien);

router.patch("/:id/khoa-mo", kiemTraVaiTro(["quan_ly"]), khoaMoNhanVien);

router.patch(
  "/:id/doi-mat-khau",
  kiemTraVaiTro(["quan_ly"]),
  doiMatKhauNhanVien,
);

router.delete("/:id", kiemTraVaiTro(["quan_ly"]), xoaNhanVien);

module.exports = router;
