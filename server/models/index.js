const sequelize = require("../utils/db");

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

Tranh.belongsTo(TacGia, {
  foreignKey: "tac_gia_id",
  as: "tac_gia",
});

Tranh.belongsTo(DanhMuc, {
  foreignKey: "danh_muc_id",
  as: "danh_muc",
});

Tranh.belongsTo(KhoHang, {
  foreignKey: "kho_id",
  as: "kho_hang",
});

// Quan he gio hang
GioHang.belongsTo(KhachHang, {
  foreignKey: "khach_hang_id",
  as: "khach_hang",
});

KhachHang.hasMany(GioHang, {
  foreignKey: "khach_hang_id",
  as: "gio_hang",
});

GioHangChiTiet.belongsTo(Tranh, {
  foreignKey: "tranh_id",
  as: "tranh",
});

Tranh.hasMany(GioHangChiTiet, {
  foreignKey: "tranh_id",
  as: "gio_hang_chi_tiet",
});

GioHangChiTiet.belongsTo(GioHang, {
  foreignKey: "gio_hang_id",
  as: "gio_hang",
});

GioHang.hasMany(GioHangChiTiet, {
  foreignKey: "gio_hang_id",
  as: "gio_hang_chi_tiet",
});

// Quan he don hang
KhachHang.hasMany(DonHang, {
  foreignKey: "khach_hang_id",
  as: "khach_hang",
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

DonViVanChuyen.hasMany(DonHang, {
  foreignKey: "don_vi_van_chuyen_id",
  as: "don_hang",
});

DonHang.belongsTo(DonViVanChuyen, {
  foreignKey: "don_vi_van_chuyen_id",
  as: "don_vi_van_chuyen",
});

VanDon.belongsTo(DonViVanChuyen, {
  foreignKey: "don_vi_id",
  as: "don_vi_van_chuyen",
});

DonViVanChuyen.hasMany(VanDon, {
  foreignKey: "don_vi_id",
  as: "van_don",
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
};
