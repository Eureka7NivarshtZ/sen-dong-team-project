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

router.use(yeuCauDangNhap);

router.get("/", yeuCauNhanVien, layTatCaPhieuNhap);
router.get("/:id", yeuCauNhanVien, layChiTietPhieuNhap);

router.post("/", kiemTraVaiTro("quan_ly"), taoPhieuNhap);
router.put("/:id/huy", kiemTraVaiTro("quan_ly"), huyPhieuNhap);
router.put("/:id/nhap-kho", kiemTraVaiTro("quan_ly"), nhapKhoPhieuNhap);

module.exports = router;

