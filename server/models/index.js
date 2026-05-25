const sequelize = require("../config/db.js");

const TaiKhoan = require("./TaiKhoan.js");
const KhachHang = require("./KhachHang.js");
const NhanVien = require("./NhanVien.js");

const Tranh = require("./Tranh");
const HinhAnhTranh = require("./HinhAnhTranh");
const TacGia = require("./TacGia.js");
const DanhMuc = require("./DanhMuc");
const KhoHang = require("./KhoHang");

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
const ThietBi = require("./ThietBi");

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
};
