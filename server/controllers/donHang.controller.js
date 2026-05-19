const { KhachHang, NhanVien, DonHang, DonViVanChuyen } = require("../models");

const taoDonHang = async (req, res) => {};
const xemDonCuaToi = async (req, res) => {};
const xemChiTietDonCuaToi = async (req, res) => {};
const huyDonCuaToi = async (req, res) => {};

const xemTatCaDonHang = async (req, res) => {
  const danhSachDonHang = await DonHang.findAll({
    include: [
      { model: KhachHang, as: "khach_hang" },
      { model: NhanVien, as: "nhan_vien" },
      { model: DonViVanChuyen, as: "don_vi_van_chuyen" },
    ],
  });

  res.json(danhSachDonHang);
};

const xemChiTietDonBatKy = async (req, res) => {};
const capNhatTrangThaiDon = async (req, res) => {};
const huyDonBatKy = async (req, res) => {};

module.exports = {
  taoDonHang,
  xemDonCuaToi,
  xemChiTietDonCuaToi,
  huyDonCuaToi,
  xemTatCaDonHang,
  xemChiTietDonBatKy,
  capNhatTrangThaiDon,
  huyDonBatKy,
};
