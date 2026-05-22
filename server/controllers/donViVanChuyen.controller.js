const { DonViVanChuyen } = require("../models");

const layTatCaDonViVanChuyen = async (req, res) => {
  const danhSach = await DonViVanChuyen.findAll({
    order: [["ten", "ASC"]],
  });

  res.json({
    success: true,
    message: "Lay danh sach don vi van chuyen thanh cong",
    data: danhSach,
  });
};

const layDonViVanChuyenHoatDong = async (req, res) => {
  const danhSach = await DonViVanChuyen.findAll({
    where: {
      hoat_dong: true,
    },
    order: [["ten", "ASC"]],
  });

  res.json({
    success: true,
    message: "Lay danh sach don vi van chuyen hoat dong thanh cong",
    data: danhSach,
  });
};

const layChiTietDonViVanChuyen = async (req, res) => {
  const { id } = req.params;

  const donVi = await DonViVanChuyen.findByPk(id);

  if (!donVi) {
    return res.status(404).json({
      success: false,
      error: "Không tìm thấy đơn vị vận chuyển",
    });
  }

  res.json({
    success: true,
    message: "Lay chi tiet don vi van chuyen thanh cong",
    data: donVi,
  });
};

const themDonViVanChuyen = async (req, res) => {
  const { ten, sdt, email, phi_co_ban, hoat_dong } = req.body;

  if (!ten) {
    return res.status(400).json({
      success: false,
      error: "Vui lòng nhập tên đơn vị vận chuyển",
    });
  }

  const donVi = await DonViVanChuyen.create({
    ten,
    sdt,
    email,
    phi_co_ban: phi_co_ban || 0,
    hoat_dong: hoat_dong === undefined ? true : hoat_dong,
  });

  res.status(201).json({
    success: true,
    message: "Them don vi van chuyen thanh cong",
    data: donVi,
  });
};

const capNhatDonViVanChuyen = async (req, res) => {
  const { id } = req.params;
  const { ten, sdt, email, phi_co_ban, hoat_dong } = req.body;

  const donVi = await DonViVanChuyen.findByPk(id);

  if (!donVi) {
    return res.status(404).json({
      success: false,
      error: "Không tìm thấy đơn vị vận chuyển",
    });
  }

  await donVi.update({
    ten,
    sdt,
    email,
    phi_co_ban,
    hoat_dong,
  });

  res.json({
    success: true,
    message: "Cap nhat don vi van chuyen thanh cong",
    data: donVi,
  });
};

const xoaDonViVanChuyen = async (req, res) => {
  const { id } = req.params;

  const donVi = await DonViVanChuyen.findByPk(id);

  if (!donVi) {
    return res.status(404).json({
      success: false,
      error: "Không tìm thấy đơn vị vận chuyển",
    });
  }

  await donVi.destroy();

  res.json({
    success: true,
    message: "Xoa don vi van chuyen thanh cong",
    data: null,
  });
};

const khoaMoDonViVanChuyen = async (req, res) => {
  const { id } = req.params;

  const donVi = await DonViVanChuyen.findByPk(id);

  if (!donVi) {
    return res.status(404).json({
      success: false,
      error: "Không tìm thấy đơn vị vận chuyển",
    });
  }

  await donVi.update({
    hoat_dong: !donVi.hoat_dong,
  });

  res.json({
    success: true,
    message: "Cap nhat trang thai don vi van chuyen thanh cong",
    data: donVi,
  });
};

module.exports = {
  layTatCaDonViVanChuyen,
  layDonViVanChuyenHoatDong,
  layChiTietDonViVanChuyen,
  themDonViVanChuyen,
  capNhatDonViVanChuyen,
  xoaDonViVanChuyen,
  khoaMoDonViVanChuyen,
};
