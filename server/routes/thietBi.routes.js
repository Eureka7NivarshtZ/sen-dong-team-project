const router = require("express").Router();

const {
  layTatCaThietBi,
  layChiTietThietBi,
  themThietBi,
  capNhatThietBi,
  xoaThietBi,
} = require("../controllers/thietBi.controller");

const {
  yeuCauDangNhap,
  kiemTraVaiTro,
  yeuCauNhanVien,
} = require("../utils/middleware");

// ========== NHÂN VIÊN: Xem thiết bị ==========
router.use(yeuCauDangNhap);
router.use(yeuCauNhanVien);
router.get("/", layTatCaThietBi);
router.get("/:id", layChiTietThietBi);

// ========== QUẢN LÝ: Quản lý thiết bị ==========
router.use(kiemTraVaiTro("quan_ly"));
router.post("/", themThietBi);
router.put("/:id", capNhatThietBi);
router.delete("/:id", xoaThietBi);
module.exports = router;
