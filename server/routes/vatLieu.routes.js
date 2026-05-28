const router = require("express").Router();

const {
  layVatLieuCanhBao,
  layChiTietVatLieu,
  themVatLieu,
  capNhatVatLieu,
  xoaVatLieu,
} = require("../controllers/vatLieu.controller");

const {
  yeuCauDangNhap,
  kiemTraVaiTro,
  yeuCauNhanVien,
} = require("../utils/middleware");

// ========== NHÂN VIÊN: Xem vật liệu ==========
router.use(yeuCauDangNhap);
router.use(yeuCauNhanVien);
router.get("/", layVatLieuCanhBao);

// ========== QUẢN LÝCTẨN: Quản lý vật liệu ==========
router.use(kiemTraVaiTro("quan_ly"));
router.get("/:id", layChiTietVatLieu);
router.post("/", themVatLieu);
router.put("/:id", capNhatVatLieu);
router.delete("/:id", xoaVatLieu);

module.exports = router;
