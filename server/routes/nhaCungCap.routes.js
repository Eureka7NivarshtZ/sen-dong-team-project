const router = require("express").Router();

const {
  layTatCaNhaCungCap,
  layChiTietNhaCungCap,
  themNhaCungCap,
  capNhatNhaCungCap,
  xoaNhaCungCap,
} = require("../controllers/nhaCungCap.controller");

const {
  yeuCauDangNhap,
  kiemTraVaiTro,
  yeuCauNhanVien,
} = require("../utils/middleware");

// ========== NHÂN VIÊN: Xem nhà cung cấp ==========
router.use(yeuCauDangNhap);
router.use(yeuCauNhanVien);
router.get("/", layTatCaNhaCungCap);

// ========== QUẢN LÝCTẨN: Quản lý nhà cung cấp ==========
router.use(kiemTraVaiTro("quan_ly"));
router.get("/:id", layChiTietNhaCungCap);
router.post("/", themNhaCungCap);
router.put("/:id", capNhatNhaCungCap);
router.delete("/:id", xoaNhaCungCap);

module.exports = router;
