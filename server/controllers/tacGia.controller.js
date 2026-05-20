const { TacGia } = require("../models");

const xemTatCaTacGia = async (req, res) => {
  const tacGia = await TacGia.findAll({
    order: [["ho_ten", "ASC"]],
  });

  res.json(tacGia);
};

const xemChiTietTacGia = async (req, res) => {
  const { id } = req.params;

  const tacGia = await TacGia.findByPk(id);

  if (!tacGia) {
    return res.status(404).json({
      error: "Khong tim thay tac gia",
    });
  }

  res.json(tacGia);
};

const themTacGia = async (req, res) => {
  const { ho_ten, ngay_sinh, sdt, dia_chi, tieu_su } = req.body;

  if (!ho_ten) {
    return res.status(400).json({
      error: "Ho ten tac gia la bat buoc",
    });
  }

  const tacGia = await TacGia.create({
    ho_ten,
    ngay_sinh,
    sdt,
    dia_chi,
    tieu_su,
  });
  res.status(201).json(tacGia);
};

const xoaTacGia = async (req, res) => {
  const { id } = req.params;

  const tacGia = await TacGia.findByPk(id);

  if (!tacGia) {
    return res.status(404).json({
      error: "Khong tim thay tac gia",
    });
  }

  await tacGia.destroy();

  res.status(204).end();
};

const capNhatTacGia = async (req, res) => {
  const { ho_ten, ngay_sinh, sdt, dia_chi, tieu_su } = req.body;
  const { id } = req.params;

  const tacGia = await TacGia.findByPk(id);

  if (!ho_ten) {
    return res.status(400).json({
      error: "Ho ten tac gia la bat buoc",
    });
  }

  if (!tacGia) {
    return res.status(404).json({
      error: "Khong tim thay tac gia",
    });
  }

  await tacGia.update({ ho_ten, ngay_sinh, sdt, dia_chi, tieu_su });

  res.json(tacGia);
};

module.exports = {
  xemTatCaTacGia,
  xemChiTietTacGia,
  themTacGia,
  xoaTacGia,
  capNhatTacGia,
};
