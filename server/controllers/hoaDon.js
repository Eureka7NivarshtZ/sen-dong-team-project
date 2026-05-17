const { v4:uuidv4 } = require('uuid')
const HoaDon = require("../models/hoaDon");

const getAll = async (req, res) => {
  const danhSachHoaDon = await HoaDon.findAll();
  res.status(200).json(danhSachHoaDon);
};

const taoHoaDon = async (req, res) => {
  
};

module.exports = { getAll, taoHoaDon };
