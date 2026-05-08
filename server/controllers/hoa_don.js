const HoaDon = require("../models/hoa_don");

const getAll = async (req, res) => {
  const danhSachHoaDon = await HoaDon.findAll();
  res.status(200).json(danhSachHoaDon);
};

const taoHoaDon = async (req, res) => {
  
};

module.exports = { getAll, taoHoaDon };
