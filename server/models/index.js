const sequelize = require("../utils/db");

const TaiKhoan = require("./TaiKhoan.js");
const KhachHang = require("./KhachHang.js");
const NhanVien = require("./NhanVien.js");

const Tranh = require("./Tranh.js");
const HinhAnhTranh = require("./HinhAnhTranh");
const TacGia = require("./TacGia.js");
const DanhMuc = require("./DanhMuc.js");
const KhoHang = require("./KhoHang.js");
const DanhGia = require("./DanhGia.js");

const KhuyenMai = require("./KhuyenMai.js");
const KhuyenMaiDanhMuc = require("./KhuyenMaiDanhMuc.js");
const KhuyenMaiTranh = require("./KhuyenMaiTranh.js");
const LichSuSuDungKhuyenMai = require("./LichSuSuDungKhuyenMai.js");
const LichSuTrangThaiDonHang = require("./LichSuTrangThaiDonHang.js");

const ThongBao = require("./ThongBao.js");
const PhanHoiHoTro = require("./PhanHoiHoTro.js");
const YeuCauHoTro = require("./YeuCauHoTro.js");

const GioHang = require("./GioHang.js");
const GioHangChiTiet = require("./GioHangChiTiet.js");

const DonViVanChuyen = require("./DonViVanChuyen.js");
const DonHang = require("./DonHang.js");
const DonHangChiTiet = require("./DonHangChiTiet.js");
const VanDon = require("./VanDon.js");

const HoaDon = require("./HoaDon.js");
const ThanhToan = require("./ThanhToan.js");

const NhaCungCap = require("./NhaCungCap.js");
const VatLieu = require("./VatLieu.js");
const PhieuNhapVatLieu = require("./PhieuNhapVatLieu.js");
const ChiTietPhieuNhap = require("./ChiTietPhieuNhap.js");
const ThietBi = require("./ThietBi.js");

// Quan he tai khoan
TaiKhoan.hasOne(NhanVien, {
  foreignKey: "tai_khoan_id",
  as: "nhan_vien",
});

NhanVien.belongsTo(TaiKhoan, {
  foreignKey: "tai_khoan_id",
  as: "tai_khoan",
});

TaiKhoan.hasOne(KhachHang, {
  foreignKey: "tai_khoan_id",
  as: "khach_hang",
});

KhachHang.belongsTo(TaiKhoan, {
  foreignKey: "tai_khoan_id",
  as: "tai_khoan",
});

// Quan he tranh
Tranh.hasMany(HinhAnhTranh, {
  foreignKey: "tranh_id",
  as: "hinh_anh",
});

HinhAnhTranh.belongsTo(Tranh, {
  foreignKey: "tranh_id",
  as: "tranh",
});

TacGia.hasMany(Tranh, {
  foreignKey: "tac_gia_id",
  as: "tranh",
});

Tranh.belongsTo(TacGia, {
  foreignKey: "tac_gia_id",
  as: "tac_gia",
});

DanhMuc.hasMany(Tranh, {
  foreignKey: "danh_muc_id",
  as: "tranh",
});

Tranh.belongsTo(DanhMuc, {
  foreignKey: "danh_muc_id",
  as: "danh_muc",
});

KhoHang.hasMany(Tranh, {
  foreignKey: "kho_id",
  as: "tranh",
});

Tranh.belongsTo(KhoHang, {
  foreignKey: "kho_id",
  as: "kho_hang",
});

// Đánh giá
DanhGia.belongsTo(KhachHang, {
  foreignKey: "khach_hang_id",
  as: "khach_hang",
});

DanhGia.belongsTo(Tranh, {
  foreignKey: "tranh_id",
  as: "tranh",
});

DanhGia.belongsTo(DonHang, {
  foreignKey: "don_hang_id",
  as: "don_hang",
});

DanhGia.belongsTo(NhanVien, {
  foreignKey: "nhan_vien_phan_hoi_id",
  as: "nhan_vien_phan_hoi",
});

KhachHang.hasMany(DanhGia, {
  foreignKey: "khach_hang_id",
  as: "danh_gia",
});

Tranh.hasMany(DanhGia, {
  foreignKey: "tranh_id",
  as: "danh_gia",
});

// Quan he gio hang
KhachHang.hasOne(GioHang, {
  foreignKey: "khach_hang_id",
  as: "gio_hang",
});

GioHang.belongsTo(KhachHang, {
  foreignKey: "khach_hang_id",
  as: "khach_hang",
});

Tranh.hasMany(GioHangChiTiet, {
  foreignKey: "tranh_id",
  as: "gio_hang_chi_tiet",
});

GioHangChiTiet.belongsTo(Tranh, {
  foreignKey: "tranh_id",
  as: "tranh",
});

GioHang.hasMany(GioHangChiTiet, {
  foreignKey: "gio_hang_id",
  as: "chi_tiet",
});

GioHangChiTiet.belongsTo(GioHang, {
  foreignKey: "gio_hang_id",
  as: "gio_hang",
});

// Don hang
KhachHang.hasMany(DonHang, {
  foreignKey: "khach_hang_id",
  as: "don_hang",
});

DonHang.belongsTo(KhachHang, {
  foreignKey: "khach_hang_id",
  as: "khach_hang",
});

NhanVien.hasMany(DonHang, {
  foreignKey: "nhan_vien_id",
  as: "don_hang",
});

DonHang.belongsTo(NhanVien, {
  foreignKey: "nhan_vien_id",
  as: "nhan_vien",
});

Tranh.hasMany(DonHangChiTiet, {
  foreignKey: "tranh_id",
  as: "don_hang_chi_tiet",
});

DonHangChiTiet.belongsTo(Tranh, {
  foreignKey: "tranh_id",
  as: "tranh",
});

DonHang.hasMany(DonHangChiTiet, {
  foreignKey: "don_hang_id",
  as: "chi_tiet",
});

DonHangChiTiet.belongsTo(DonHang, {
  foreignKey: "don_hang_id",
  as: "don_hang",
});

// Van chuyen
DonViVanChuyen.hasMany(DonHang, {
  foreignKey: "don_vi_van_chuyen_id",
  as: "don_hang",
});

DonHang.belongsTo(DonViVanChuyen, {
  foreignKey: "don_vi_van_chuyen_id",
  as: "don_vi_van_chuyen",
});

DonHang.hasOne(VanDon, {
  foreignKey: "don_hang_id",
  as: "van_don",
});

VanDon.belongsTo(DonHang, {
  foreignKey: "don_hang_id",
  as: "don_hang",
});

DonViVanChuyen.hasMany(VanDon, {
  foreignKey: "don_vi_id",
  as: "van_don",
});

VanDon.belongsTo(DonViVanChuyen, {
  foreignKey: "don_vi_id",
  as: "don_vi_van_chuyen",
});

// Hoa don - Thanh toan
DonHang.hasMany(HoaDon, {
  foreignKey: "don_hang_id",
  as: "hoa_don",
});

HoaDon.belongsTo(DonHang, {
  foreignKey: "don_hang_id",
  as: "don_hang",
});

HoaDon.belongsTo(HoaDon, {
  foreignKey: "hoa_don_goc_id",
  as: "hoa_don_goc",
});

HoaDon.hasMany(ThanhToan, {
  foreignKey: "hoa_don_id",
  as: "thanh_toan",
});

ThanhToan.belongsTo(HoaDon, {
  foreignKey: "hoa_don_id",
  as: "hoa_don",
});

// Kho & Vật tư
NhaCungCap.hasMany(VatLieu, {
  foreignKey: "nha_cung_cap_id",
  as: "vat_lieu",
});

VatLieu.belongsTo(NhaCungCap, {
  foreignKey: "nha_cung_cap_id",
  as: "nha_cung_cap",
});

NhaCungCap.hasMany(ThietBi, {
  foreignKey: "nha_cung_cap_id",
  as: "thiet_bi",
});

ThietBi.belongsTo(NhaCungCap, {
  foreignKey: "nha_cung_cap_id",
  as: "nha_cung_cap",
});

NhaCungCap.hasMany(PhieuNhapVatLieu, {
  foreignKey: "nha_cung_cap_id",
  as: "phieu_nhap",
});

PhieuNhapVatLieu.belongsTo(NhaCungCap, {
  foreignKey: "nha_cung_cap_id",
  as: "nha_cung_cap",
});

NhanVien.hasMany(PhieuNhapVatLieu, {
  foreignKey: "nhan_vien_id",
  as: "phieu_nhap_vat_lieu",
});

PhieuNhapVatLieu.belongsTo(NhanVien, {
  foreignKey: "nhan_vien_id",
  as: "nhan_vien",
});

PhieuNhapVatLieu.hasMany(ChiTietPhieuNhap, {
  foreignKey: "phieu_id",
  as: "chi_tiet",
});

ChiTietPhieuNhap.belongsTo(PhieuNhapVatLieu, {
  foreignKey: "phieu_id",
  as: "phieu_nhap",
});

VatLieu.hasMany(ChiTietPhieuNhap, {
  foreignKey: "vat_lieu_id",
  as: "chi_tiet_phieu_nhap",
});

ChiTietPhieuNhap.belongsTo(VatLieu, {
  foreignKey: "vat_lieu_id",
  as: "vat_lieu",
});

KhuyenMai.belongsToMany(Tranh, {
  through: KhuyenMaiTranh,
  foreignKey: "khuyen_mai_id",
  otherKey: "tranh_id",
  as: "tranh_ap_dung",
});
Tranh.belongsToMany(KhuyenMai, {
  through: KhuyenMaiTranh,
  foreignKey: "tranh_id",
  otherKey: "khuyen_mai_id",
  as: "khuyen_mai",
});

KhuyenMai.belongsToMany(DanhMuc, {
  through: KhuyenMaiDanhMuc,
  foreignKey: "khuyen_mai_id",
  otherKey: "danh_muc_id",
  as: "danh_muc_ap_dung",
});
DanhMuc.belongsToMany(KhuyenMai, {
  through: KhuyenMaiDanhMuc,
  foreignKey: "danh_muc_id",
  otherKey: "khuyen_mai_id",
  as: "khuyen_mai",
});

KhuyenMai.hasMany(LichSuSuDungKhuyenMai, {
  foreignKey: "khuyen_mai_id",
  as: "lich_su_su_dung",
});
LichSuSuDungKhuyenMai.belongsTo(KhuyenMai, {
  foreignKey: "khuyen_mai_id",
  as: "khuyen_mai",
});

YeuCauHoTro.belongsTo(KhachHang, {
  foreignKey: "khach_hang_id",
  as: "khach_hang",
});
YeuCauHoTro.belongsTo(DonHang, { foreignKey: "don_hang_id", as: "don_hang" });
YeuCauHoTro.belongsTo(NhanVien, {
  foreignKey: "nhan_vien_phu_trach_id",
  as: "nhan_vien_phu_trach",
});
YeuCauHoTro.hasMany(PhanHoiHoTro, {
  foreignKey: "yeu_cau_ho_tro_id",
  as: "phan_hoi",
});

PhanHoiHoTro.belongsTo(YeuCauHoTro, {
  foreignKey: "yeu_cau_ho_tro_id",
  as: "yeu_cau_ho_tro",
});
PhanHoiHoTro.belongsTo(KhachHang, {
  foreignKey: "khach_hang_id",
  as: "khach_hang",
});
PhanHoiHoTro.belongsTo(NhanVien, {
  foreignKey: "nhan_vien_id",
  as: "nhan_vien",
});

LichSuTrangThaiDonHang.belongsTo(DonHang, {
  foreignKey: "don_hang_id",
  as: "don_hang",
});
LichSuTrangThaiDonHang.belongsTo(NhanVien, {
  foreignKey: "nhan_vien_id",
  as: "nhan_vien",
});
DonHang.hasMany(LichSuTrangThaiDonHang, {
  foreignKey: "don_hang_id",
  as: "lich_su_trang_thai",
});

ThongBao.belongsTo(KhachHang, {
  foreignKey: "khach_hang_id",
  as: "khach_hang",
});
ThongBao.belongsTo(NhanVien, { foreignKey: "nhan_vien_id", as: "nhan_vien" });

module.exports = {
  sequelize,
  TaiKhoan,
  KhachHang,
  NhanVien,
  Tranh,
  HinhAnhTranh,
  TacGia,
  DanhMuc,
  KhoHang,
  GioHang,
  GioHangChiTiet,
  DonHang,
  DonHangChiTiet,
  VanDon,
  DonViVanChuyen,
  HoaDon,
  ThanhToan,
  NhaCungCap,
  VatLieu,
  PhieuNhapVatLieu,
  ChiTietPhieuNhap,
  ThietBi,
  DanhGia,
  KhuyenMai,
  KhuyenMaiDanhMuc,
  KhuyenMaiTranh,
  LichSuSuDungKhuyenMai,
  LichSuTrangThaiDonHang,
  PhanHoiHoTro,
  ThongBao,
  YeuCauHoTro,
};
