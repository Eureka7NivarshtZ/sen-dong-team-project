const sequelize = require("../utils/db");

const TaiKhoan = require("./TaiKhoan.js");
const KhachHang = require("./KhachHang.js");
const NhanVien = require("./NhanVien.js");

const Tranh = require("./Tranh");
const HinhAnhTranh = require("./HinhAnhTranh");
const TacGia = require("./TacGia.js");
const DanhMuc = require("./DanhMuc");
const KhoHang = require("./KhoHang");

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
};
