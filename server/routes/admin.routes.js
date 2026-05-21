const router = require("express").Router();
const { yeuCauDangNhap, kiemTraVaiTro } = require("../utils/middleware");

router.use(yeuCauDangNhap);
router.use(kiemTraVaiTro("quan_ly"));

// Dashboard

// Quản lý tranh
const {
  taoTranh,
  capNhatTranh,
  anTranh,
  xoaTranh,
  xemTatCaTranh,
} = require("../controllers/tranh.controller");

const {
  themHinhAnhTranh,
  capNhatHinhAnhTranh,
  datAnhChinh,
  xoaHinhAnhTranh,
} = require("../controllers/hinhAnhTranh.controller");

router.get("/tranh", xemTatCaTranh);
router.post("/tranh", taoTranh);
router.put("/tranh/:id", capNhatTranh);
router.put("/tranh/:id/an", anTranh);
router.delete("/tranh/:id", xoaTranh);

router.post("/tranh/:tranhId/hinh-anh", themHinhAnhTranh);
router.put("/tranh/hinh-anh/:id", capNhatHinhAnhTranh);
router.put("/tranh/hinh-anh/:id/chinh", datAnhChinh);
router.delete("/tranh/hinh-anh/:id", xoaHinhAnhTranh);

// Quản lý danh mục
const {
  themDanhMuc,
  xoaDanhMuc,
  capNhatDanhMuc,
  xemTatCaDanhMuc,
} = require("../controllers/danhMuc.controller");

router.get("/danh-muc", xemTatCaDanhMuc);
router.post("/danh-muc", themDanhMuc);
router.put("/danh-muc/:id", capNhatDanhMuc);
router.delete("/danh-muc/:id", xoaDanhMuc);

// Quản lý tác giả
const {
  themTacGia,
  xoaTacGia,
  capNhatTacGia,
  xemTatCaTacGia,
} = require("../controllers/tacGia.controller");

router.get("/tac-gia", xemTatCaTacGia);
router.post("/tac-gia", themTacGia);
router.put("/tac-gia/:id", capNhatTacGia);
router.delete("/tac-gia/:id", xoaTacGia);

// Quản lý đơn hàng
const {
  xemTatCaDonHang,
  xemChiTietDonBatKy,
  capNhatTrangThaiDon,
  huyDonBatKy,
} = require("../controllers/donHang.controller");

router.get("/don-hang", xemTatCaDonHang);
router.get("/don-hang/:id", xemChiTietDonBatKy);
router.put("/don-hang/:id/trang-thai", capNhatTrangThaiDon);
router.put("/don-hang/:id/huy", huyDonBatKy);

// Quản lý khách hàng
const {
  xemTatCaKhachHang,
  xemChiTietKhachHang,
  khoa_KhachHang,
} = require("../controllers/khachHang.controller");

router.get("/khach-hang", xemTatCaKhachHang);
router.get("/khach-hang/:id", xemChiTietKhachHang);
router.put("/khach-hang/:id/khoa", khoa_KhachHang);

// Quản lý nhân viên
const {
  xemTatCaNhanVien,
  xemChiTietNhanVien,
  khoaNhanVien,
  chieuTuyenNhanVien,
} = require("../controllers/nhanVien.controller");

router.get("/nhan-vien", xemTatCaNhanVien);
router.get("/nhan-vien/:id", xemChiTietNhanVien);
router.put("/nhan-vien/:id/khoa", khoaNhanVien);
router.post("/nhan-vien", chieuTuyenNhanVien);

module.exports = router;
