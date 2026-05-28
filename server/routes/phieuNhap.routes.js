const router = require("express").Router();

const {
  layTatCaPhieuNhap,
  layChiTietPhieuNhap,
  taoPhieuNhap,
  nhapKhoPhieuNhap,
  huyPhieuNhap,
} = require("../controllers/phieuNhapVatLieu.controller");

const {
  yeuCauDangNhap,
  kiemTraVaiTro,
  yeuCauNhanVien,
} = require("../utils/middleware");

// ========== NHÂN VIÊN: Xem phiếu nhập ==========
router.use(yeuCauDangNhap);
router.use(yeuCauNhanVien);

router.get("/", layTatCaPhieuNhap);
router.get("/:id", layChiTietPhieuNhap);

// ========== QUẢN LÝ: Quản lý phiếu nhập ==========
router.post("/", kiemTraVaiTro("quan_ly"), taoPhieuNhap);
router.put("/:id/huy", kiemTraVaiTro("quan_ly"), huyPhieuNhap);
router.put("/:id/nhap-kho", kiemTraVaiTro("quan_ly"), nhapKhoPhieuNhap);
module.exports = router;
