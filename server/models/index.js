const sequelize = require("../utils/db");

const TaiKhoan = require("./TaiKhoan.js");
const KhachHang = require("./KhachHang.js");
const NhanVien = require("./NhanVien.js");

const Tranh = require("./Tranh.js");
const HinhAnhTranh = require("./HinhAnhTranh.js");
const TacGia = require("./TacGia.js");
const DanhMuc = require("./DanhMuc.js");
const DanhGia = require("./DanhGia.js");

const KhuyenMai = require("./KhuyenMai.js");
const KhuyenMaiDanhMuc = require("./KhuyenMaiDanhMuc.js");
const KhuyenMaiTranh = require("./KhuyenMaiTranh.js");
const LichSuSuDungKhuyenMai = require("./LichSuSuDungKhuyenMai.js");

const ThongBao = require("./ThongBao.js");

const GioHang = require("./GioHang.js");
const GioHangChiTiet = require("./GioHangChiTiet.js");

const DonViVanChuyen = require("./DonViVanChuyen.js");
const DonHang = require("./DonHang.js");
const DonHangChiTiet = require("./DonHangChiTiet.js");

const HoaDon = require("./HoaDon.js");
const ThanhToan = require("./ThanhToan.js");

// ==================== TÀI KHOẢN - NHÂN VIÊN ====================
TaiKhoan.hasOne(NhanVien, {
  foreignKey: "tai_khoan_id",
  as: "nhan_vien",
});

NhanVien.belongsTo(TaiKhoan, {
  foreignKey: "tai_khoan_id",
  as: "tai_khoan",
});

// ==================== TÀI KHOẢN - KHÁCH HÀNG ====================
TaiKhoan.hasOne(KhachHang, {
  foreignKey: "tai_khoan_id",
  as: "khach_hang",
});

KhachHang.belongsTo(TaiKhoan, {
  foreignKey: "tai_khoan_id",
  as: "tai_khoan",
});

// ==================== TRANH - HÌNH ẢNH ====================
Tranh.hasMany(HinhAnhTranh, {
  foreignKey: "tranh_id",
  as: "hinh_anh",
});

HinhAnhTranh.belongsTo(Tranh, {
  foreignKey: "tranh_id",
  as: "tranh",
});

// ==================== TÁC GIẢ - TRANH ====================
TacGia.hasMany(Tranh, {
  foreignKey: "tac_gia_id",
  as: "tranh",
});

Tranh.belongsTo(TacGia, {
  foreignKey: "tac_gia_id",
  as: "tac_gia",
});

// ==================== DANH MỤC - TRANH ====================
DanhMuc.hasMany(Tranh, {
  foreignKey: "danh_muc_id",
  as: "tranh",
});

Tranh.belongsTo(DanhMuc, {
  foreignKey: "danh_muc_id",
  as: "danh_muc",
});

// ==================== ĐÁNH GIÁ ====================
KhachHang.hasMany(DanhGia, {
  foreignKey: "khach_hang_id",
  as: "danh_gia",
});

DanhGia.belongsTo(KhachHang, {
  foreignKey: "khach_hang_id",
  as: "khach_hang",
});

Tranh.hasMany(DanhGia, {
  foreignKey: "tranh_id",
  as: "danh_gia",
});

DanhGia.belongsTo(Tranh, {
  foreignKey: "tranh_id",
  as: "tranh",
});

DonHang.hasMany(DanhGia, {
  foreignKey: "don_hang_id",
  as: "danh_gia",
});

DanhGia.belongsTo(DonHang, {
  foreignKey: "don_hang_id",
  as: "don_hang",
});

NhanVien.hasMany(DanhGia, {
  foreignKey: "nhan_vien_phan_hoi_id",
  as: "danh_gia_phan_hoi",
});

DanhGia.belongsTo(NhanVien, {
  foreignKey: "nhan_vien_phan_hoi_id",
  as: "nhan_vien_phan_hoi",
});

// ==================== GIỎ HÀNG ====================
KhachHang.hasOne(GioHang, {
  foreignKey: "khach_hang_id",
  as: "gio_hang",
});

GioHang.belongsTo(KhachHang, {
  foreignKey: "khach_hang_id",
  as: "khach_hang",
});

GioHang.hasMany(GioHangChiTiet, {
  foreignKey: "gio_hang_id",
  as: "chi_tiet",
});

GioHangChiTiet.belongsTo(GioHang, {
  foreignKey: "gio_hang_id",
  as: "gio_hang",
});

Tranh.hasMany(GioHangChiTiet, {
  foreignKey: "tranh_id",
  as: "gio_hang_chi_tiet",
});

GioHangChiTiet.belongsTo(Tranh, {
  foreignKey: "tranh_id",
  as: "tranh",
});

// ==================== ĐƠN HÀNG ====================
// Quan trọng:
// Query từ KhachHang include DonHang phải dùng as: "don_hang"
// Query từ DonHang include KhachHang phải dùng as: "khach_hang"
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

DonHang.hasMany(DonHangChiTiet, {
  foreignKey: "don_hang_id",
  as: "chi_tiet",
});

DonHangChiTiet.belongsTo(DonHang, {
  foreignKey: "don_hang_id",
  as: "don_hang",
});

Tranh.hasMany(DonHangChiTiet, {
  foreignKey: "tranh_id",
  as: "don_hang_chi_tiet",
});

DonHangChiTiet.belongsTo(Tranh, {
  foreignKey: "tranh_id",
  as: "tranh",
});

// ==================== ĐƠN VỊ VẬN CHUYỂN ====================
DonViVanChuyen.hasMany(DonHang, {
  foreignKey: "don_vi_van_chuyen_id",
  as: "don_hang",
});

DonHang.belongsTo(DonViVanChuyen, {
  foreignKey: "don_vi_van_chuyen_id",
  as: "don_vi_van_chuyen",
});

// ==================== HÓA ĐƠN - THANH TOÁN ====================
DonHang.hasMany(HoaDon, {
  foreignKey: "don_hang_id",
  as: "hoa_don",
});

HoaDon.belongsTo(DonHang, {
  foreignKey: "don_hang_id",
  as: "don_hang",
});

// Hóa đơn gốc / hóa đơn điều chỉnh
HoaDon.belongsTo(HoaDon, {
  foreignKey: "hoa_don_goc_id",
  as: "hoa_don_goc",
});

HoaDon.hasMany(HoaDon, {
  foreignKey: "hoa_don_goc_id",
  as: "hoa_don_dieu_chinh",
});

HoaDon.hasMany(ThanhToan, {
  foreignKey: "hoa_don_id",
  as: "thanh_toan",
});

ThanhToan.belongsTo(HoaDon, {
  foreignKey: "hoa_don_id",
  as: "hoa_don",
});

// ==================== KHUYẾN MÃI - TRANH ====================
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

// ==================== KHUYẾN MÃI - DANH MỤC ====================
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

// ==================== LỊCH SỬ SỬ DỤNG KHUYẾN MÃI ====================
KhuyenMai.hasMany(LichSuSuDungKhuyenMai, {
  foreignKey: "khuyen_mai_id",
  as: "lich_su_su_dung",
});

LichSuSuDungKhuyenMai.belongsTo(KhuyenMai, {
  foreignKey: "khuyen_mai_id",
  as: "khuyen_mai",
});

KhachHang.hasMany(LichSuSuDungKhuyenMai, {
  foreignKey: "khach_hang_id",
  as: "lich_su_su_dung_khuyen_mai",
});

LichSuSuDungKhuyenMai.belongsTo(KhachHang, {
  foreignKey: "khach_hang_id",
  as: "khach_hang",
});

DonHang.hasMany(LichSuSuDungKhuyenMai, {
  foreignKey: "don_hang_id",
  as: "lich_su_su_dung_khuyen_mai",
});

LichSuSuDungKhuyenMai.belongsTo(DonHang, {
  foreignKey: "don_hang_id",
  as: "don_hang",
});

// ==================== KHUYẾN MÃI - ĐƠN HÀNG ====================
KhuyenMai.hasMany(DonHang, {
  foreignKey: "khuyen_mai_id",
  as: "don_hang",
});

DonHang.belongsTo(KhuyenMai, {
  foreignKey: "khuyen_mai_id",
  as: "khuyen_mai",
});

// ==================== THÔNG BÁO ====================
KhachHang.hasMany(ThongBao, {
  foreignKey: "khach_hang_id",
  as: "thong_bao",
});

ThongBao.belongsTo(KhachHang, {
  foreignKey: "khach_hang_id",
  as: "khach_hang",
});

NhanVien.hasMany(ThongBao, {
  foreignKey: "nhan_vien_id",
  as: "thong_bao",
});

ThongBao.belongsTo(NhanVien, {
  foreignKey: "nhan_vien_id",
  as: "nhan_vien",
});

// ==================== EXPORT ====================
module.exports = {
  sequelize,

  TaiKhoan,
  KhachHang,
  NhanVien,

  Tranh,
  HinhAnhTranh,
  TacGia,
  DanhMuc,
  DanhGia,

  KhuyenMai,
  KhuyenMaiDanhMuc,
  KhuyenMaiTranh,
  LichSuSuDungKhuyenMai,

  ThongBao,

  GioHang,
  GioHangChiTiet,

  DonViVanChuyen,
  DonHang,
  DonHangChiTiet,

  HoaDon,
  ThanhToan,
};
