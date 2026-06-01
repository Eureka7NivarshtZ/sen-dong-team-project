const router = require("express").Router();

const {
  xemTatCaDonHang,
  xemChiTietDonBatKy,
  capNhatTrangThaiDon,
  huyDonBatKy,
  taoDonHang,
  xemDonCuaToi,
  xemChiTietDonCuaToi,
  huyDonCuaToi,
} = require("../controllers/donHang.controller");

const {
  yeuCauDangNhap,
  yeuCauKhachHang,
  yeuCauNhanVien,
} = require("../utils/middleware");

router.use(yeuCauDangNhap);

// ========== KHÁCH HÀNG: Quản lý đơn hàng của riêng mình ==========
router.post("/them", yeuCauKhachHang, taoDonHang);
router.get("/cua-toi", yeuCauKhachHang, xemDonCuaToi);
router.get("/chi-tiet/:id", yeuCauKhachHang, xemChiTietDonCuaToi);
router.put("/huy/:id", yeuCauKhachHang, huyDonCuaToi);

// ========== NHÂN VIÊN: Quản lý tất cả đơn hàng ==========
router.use(yeuCauNhanVien);
router.get("/", xemTatCaDonHang);
router.get("/:id", xemChiTietDonBatKy);
router.put("/:id/trang-thai", capNhatTrangThaiDon);
router.put("/:id/huy", huyDonBatKy);

module.exports = router;
