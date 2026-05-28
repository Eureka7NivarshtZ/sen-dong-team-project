const router = require("express").Router();

const {
  xemTatCaDanhMuc,
  xemChiTietDanhMuc,
  themDanhMuc,
  xoaDanhMuc,
  capNhatDanhMuc,
} = require("../controllers/danhMuc.controller");

const { yeuCauDangNhap, kiemTraVaiTro } = require("../utils/middleware");

// ========== CÔNG KHAI: Xem danh mục ==========
router.get("/", xemTatCaDanhMuc);
router.get("/:id", xemChiTietDanhMuc);

// ========== QUẢN LÝ: Quản lý danh mục ==========
router.use(yeuCauDangNhap);
router.use(kiemTraVaiTro("quan_ly"));
router.post("/", themDanhMuc);
router.put("/:id", capNhatDanhMuc);
router.delete("/:id", xoaDanhMuc);

module.exports = router;
