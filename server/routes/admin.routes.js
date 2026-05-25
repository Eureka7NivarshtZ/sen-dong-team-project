const router = require("express").Router();

const {
  yeuCauDangNhap,
  kiemTraVaiTro,
  yeuCauNhanVien,
} = require("../config/middleware");

router.use(yeuCauDangNhap);
router.use(yeuCauNhanVien);
router.use(kiemTraVaiTro("quan_ly"));

// Dashboard
const {
  tongQuanDashboard,
  donHangGanDay,
  doanhThuTheoThang,
} = require("../controllers/dashboard.controller");

router.get("/dashboard/", tongQuanDashboard);
router.get("/dashboard/don-hang-gan-day", donHangGanDay);
router.get("/dashboard/doanh-thu-theo-thang", doanhThuTheoThang);

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

// Quản lý đơn vị vận chuyển
const {
  layTatCaDonViVanChuyen,
  layChiTietDonViVanChuyen,
  themDonViVanChuyen,
  capNhatDonViVanChuyen,
  xoaDonViVanChuyen,
  khoaMoDonViVanChuyen,
} = require("../controllers/donViVanChuyen.controller");

router.get("/don-vi-van-chuyen/", layTatCaDonViVanChuyen);
router.get("/don-vi-van-chuyen/:id", layChiTietDonViVanChuyen);
router.post("/don-vi-van-chuyen/", themDonViVanChuyen);
router.put("/don-vi-van-chuyen/:id", capNhatDonViVanChuyen);
router.patch("/don-vi-van-chuyen/:id/khoa-mo", khoaMoDonViVanChuyen);
router.delete("/don-vi-van-chuyen/:id", xoaDonViVanChuyen);

// Quản lý vận đơn
const {
  taoVanDon,
  layTatCaVanDon,
  layChiTietVanDon,
  capNhatTrangThaiVanDon,
  capNhatVanDon,
  xoaVanDon,
} = require("../controllers/vanDon.controller");

router.post(
  "/van-don/don-hang/:don_hang_id",
  kiemTraVaiTro(["quan_ly", "ban_hang", "kho"]),
  taoVanDon,
);

router.get(
  "/van-don/",
  kiemTraVaiTro(["quan_ly", "ban_hang", "kho"]),
  layTatCaVanDon,
);

router.get(
  "/van-don/:id",
  kiemTraVaiTro(["quan_ly", "ban_hang", "kho"]),
  layChiTietVanDon,
);

router.put(
  "/van-don/:id",
  kiemTraVaiTro(["quan_ly", "ban_hang", "kho"]),
  capNhatVanDon,
);

router.patch(
  "/van-don/:id/trang-thai",
  kiemTraVaiTro(["quan_ly", "ban_hang", "kho"]),
  capNhatTrangThaiVanDon,
);

router.delete("/van-don/:id", kiemTraVaiTro("quan_ly"), xoaVanDon);

// Quản lý hóa đơn
const {
  taoHoaDon,
  layTatCaHoaDon,
  layChiTietHoaDon,
  huyHoaDon,
} = require("../controllers/hoaDon.controller");

router.get("/hoa-don/", kiemTraVaiTro(["quan_ly", "ban_hang"]), layTatCaHoaDon);

router.get(
  "/hoa-don/:id",
  kiemTraVaiTro(["quan_ly", "ban_hang"]),
  layChiTietHoaDon,
);

router.post("/hoa-don/", kiemTraVaiTro(["quan_ly", "ban_hang"]), taoHoaDon);

router.patch("/hoa-don/:id/huy", kiemTraVaiTro("quan_ly"), huyHoaDon);

// Quản lý thanh toán
const {
  taoThanhToan,
  layTatCaThanhToan,
  layChiTietThanhToan,
  capNhatTrangThaiThanhToan,
} = require("../controllers/thanhToan.controller");

router.get(
  "/thanh-toan/",
  kiemTraVaiTro(["quan_ly", "ban_hang"]),
  layTatCaThanhToan,
);

router.get(
  "/thanh-toan/:id",
  kiemTraVaiTro(["quan_ly", "ban_hang"]),
  layChiTietThanhToan,
);

router.post(
  "/thanh-toan/",
  kiemTraVaiTro(["quan_ly", "ban_hang"]),
  taoThanhToan,
);

router.patch(
  "/thanh-toan/:id/trang-thai",
  kiemTraVaiTro(["quan_ly", "ban_hang"]),
  capNhatTrangThaiThanhToan,
);

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
  layTatCaNhanVien,
  layChiTietNhanVien,
  themNhanVien,
  capNhatNhanVien,
  khoaMoNhanVien,
  doiMatKhauNhanVien,
  xoaNhanVien,
} = require("../controllers/nhanVien.controller");

router.get("/nhan-vien", layTatCaNhanVien);
router.get("/nhan-vien/:id", layChiTietNhanVien);
router.post("/", themNhanVien);
router.put("/nhan-vien/:id", capNhatNhanVien);
router.patch("/nhan-vien/:id/khoa-mo", khoaMoNhanVien);
router.patch("/nhan-vien/:id/doi-mat-khau", doiMatKhauNhanVien);
router.delete("/nhan-vien/:id", xoaNhanVien);

// ==================== KHO: NHÀ CUNG CẤP ====================
const {
  layTatCaNhaCungCap,
  layChiTietNhaCungCap,
  themNhaCungCap,
  capNhatNhaCungCap,
  xoaNhaCungCap,
} = require("../controllers/nhaCungCap.controller");

router.get(
  "/kho/nha-cung-cap",
  kiemTraVaiTro(["quan_ly", "kho"]),
  layTatCaNhaCungCap,
);

router.get(
  "/kho/nha-cung-cap/:id",
  kiemTraVaiTro(["quan_ly", "kho"]),
  layChiTietNhaCungCap,
);

router.post(
  "/kho/nha-cung-cap",
  kiemTraVaiTro(["quan_ly", "kho"]),
  themNhaCungCap,
);

router.put(
  "/kho/nha-cung-cap/:id",
  kiemTraVaiTro(["quan_ly", "kho"]),
  capNhatNhaCungCap,
);

router.delete("/kho/nha-cung-cap/:id", kiemTraVaiTro("quan_ly"), xoaNhaCungCap);

// ==================== KHO: VẬT LIỆU ====================
const {
  layTatCaVatLieu,
  layVatLieuCanhBao,
  layChiTietVatLieu,
  themVatLieu,
  capNhatVatLieu,
  xoaVatLieu,
} = require("../controllers/vatLieu.controller");

router.get("/kho/vat-lieu", kiemTraVaiTro(["quan_ly", "kho"]), layTatCaVatLieu);

router.get(
  "/kho/vat-lieu/canh-bao",
  kiemTraVaiTro(["quan_ly", "kho"]),
  layVatLieuCanhBao,
);

router.get(
  "/kho/vat-lieu/:id",
  kiemTraVaiTro(["quan_ly", "kho"]),
  layChiTietVatLieu,
);

router.post("/kho/vat-lieu", kiemTraVaiTro(["quan_ly", "kho"]), themVatLieu);

router.put(
  "/kho/vat-lieu/:id",
  kiemTraVaiTro(["quan_ly", "kho"]),
  capNhatVatLieu,
);

router.delete("/kho/vat-lieu/:id", kiemTraVaiTro("quan_ly"), xoaVatLieu);

// ==================== KHO: PHIẾU NHẬP ====================
const {
  layTatCaPhieuNhap,
  layChiTietPhieuNhap,
  taoPhieuNhap,
  nhapKhoPhieuNhap,
  huyPhieuNhap,
} = require("../controllers/phieuNhapVatLieu.controller");

router.get(
  "/kho/phieu-nhap",
  kiemTraVaiTro(["quan_ly", "kho"]),
  layTatCaPhieuNhap,
);

router.get(
  "/kho/phieu-nhap/:id",
  kiemTraVaiTro(["quan_ly", "kho"]),
  layChiTietPhieuNhap,
);

router.post("/kho/phieu-nhap", kiemTraVaiTro(["quan_ly", "kho"]), taoPhieuNhap);

router.patch(
  "/kho/phieu-nhap/:id/nhap-kho",
  kiemTraVaiTro(["quan_ly", "kho"]),
  nhapKhoPhieuNhap,
);

router.patch(
  "/kho/phieu-nhap/:id/huy",
  kiemTraVaiTro(["quan_ly", "kho"]),
  huyPhieuNhap,
);

// ==================== KHO: THIẾT BỊ ====================
const {
  layTatCaThietBi,
  layChiTietThietBi,
  themThietBi,
  capNhatThietBi,
  xoaThietBi,
} = require("../controllers/thietBi.controller");

router.get("/kho/thiet-bi", kiemTraVaiTro(["quan_ly", "kho"]), layTatCaThietBi);

router.get(
  "/kho/thiet-bi/:id",
  kiemTraVaiTro(["quan_ly", "kho"]),
  layChiTietThietBi,
);

router.post("/kho/thiet-bi", kiemTraVaiTro(["quan_ly", "kho"]), themThietBi);

router.put(
  "/kho/thiet-bi/:id",
  kiemTraVaiTro(["quan_ly", "kho"]),
  capNhatThietBi,
);

router.delete("/kho/thiet-bi/:id", kiemTraVaiTro("quan_ly"), xoaThietBi);

module.exports = router;
