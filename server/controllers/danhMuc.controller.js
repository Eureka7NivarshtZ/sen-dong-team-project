const { DanhMuc } = require("../models");

const xemTatCaDanhMuc = async (req, res) => {
  const danhMuc = await DanhMuc.findAll({
    order: [["ten", "ASC"]],
  });

  res.json({
    success: true,
    message: "Lay danh sach danh muc thanh cong",
    data: danhMuc,
  });
};

const xemChiTietDanhMuc = async (req, res) => {
  const { id } = req.params;

  const danhMuc = await DanhMuc.findByPk(id);

  if (!danhMuc) {
    return res.status(404).json({
      success: false,
      error: "Khong tim thay danh muc",
    });
  }

  res.json({
    success: true,
    message: "Lay chi tiet danh muc thanh cong",
    data: danhMuc,
  });
};

const themDanhMuc = async (req, res) => {
  const { ten } = req.body;

  if (!ten) {
    return res.status(400).json({
      success: false,
      error: "Ten danh muc la bat buoc",
    });
  }

  const danhMuc = await DanhMuc.create({ ten });
  res.status(201).json({
    success: true,
    message: "Them danh muc thanh cong",
    data: danhMuc,
  });
};

const xoaDanhMuc = async (req, res) => {
  const { id } = req.params;
  const danhMuc = await DanhMuc.findByPk(id);
  if (!danhMuc) {
    return res.status(404).json({
      success: false,
      error: "Khong tim thay danh muc",
    });
  }

  await danhMuc.destroy();

  res.json({
    success: true,
    message: "Xoa danh muc thanh cong",
    data: null,
  });
};

const capNhatDanhMuc = async (req, res) => {
  const { id } = req.params;
  const { ten } = req.body;

  const danhMuc = await DanhMuc.findByPk(id);

  if (!danhMuc) {
    return res.status(404).json({
      success: false,
      error: "Khong tim thay danh muc",
    });
  }

  await danhMuc.update({ ten });

  res.json({
    success: true,
    message: "Cap nhat danh muc thanh cong",
    data: danhMuc,
  });
};

module.exports = {
  xemTatCaDanhMuc,
  xemChiTietDanhMuc,
  themDanhMuc,
  xoaDanhMuc,
  capNhatDanhMuc,
};
