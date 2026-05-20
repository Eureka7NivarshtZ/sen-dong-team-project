const { DanhMuc } = require("../models");

const xemTatCaDanhMuc = async (req, res) => {
  const danhMuc = await DanhMuc.findAll({
    order: [["ten", "ASC"]],
  });

  res.json(danhMuc);
};

const xemChiTietDanhMuc = async (req, res) => {
  const { id } = req.params;

  const danhMuc = await DanhMuc.findByPk(id);

  if (!danhMuc) {
    return res.status(404).json({
      error: "Khong tim thay danh muc",
    });
  }

  res.json(danhMuc);
};

const themDanhMuc = async (req, res) => {
  const { ten } = req.body;

  if (!ten) {
    return res.status(400).json({
      error: "Ten danh muc la bat buoc",
    });
  }

  const danhMuc = await DanhMuc.create({ ten });
  res.status(201).json(danhMuc);
};

const xoaDanhMuc = async (req, res) => {
  const { id } = req.params;

  const danhMuc = await DanhMuc.findByPk(id);
  if (!danhMuc) {
    return res.status(404).json({
      error: "Khong tim thay danh muc",
    });
  }

  await danhMuc.destroy();

  res.status(204).end();
};

const capNhatDanhMuc = async (req, res) => {
  const { id } = req.params;
  const { ten } = req.body;

  const danhMuc = await DanhMuc.findByPk(id);

  if (!danhMuc) {
    return res.status(404).json({
      error: "Khong tim thay danh muc",
    });
  }

  await danhMuc.update({ ten });

  res.json(danhMuc);
};

module.exports = {
  xemTatCaDanhMuc,
  xemChiTietDanhMuc,
  themDanhMuc,
  xoaDanhMuc,
  capNhatDanhMuc,
};
