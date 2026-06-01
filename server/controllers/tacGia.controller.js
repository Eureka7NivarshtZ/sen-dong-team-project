const {
  TacGia,
  Tranh,
  sequelize,
  HinhAnhTranh,
  DonHangChiTiet,
  GioHangChiTiet,
  DanhGia,
} = require("../models");

const xemTatCaTacGia = async (req, res) => {
  const tacGia = await TacGia.findAll({
    order: [["ho_ten", "ASC"]],
  });

  res.json({
    success: true,
    message: "Lay danh sach tac gia thanh cong",
    data: tacGia,
  });
};

const xemChiTietTacGia = async (req, res) => {
  const { id } = req.params;

  const tacGia = await TacGia.findByPk(id);

  if (!tacGia) {
    return res.status(404).json({
      success: false,
      error: "Khong tim thay tac gia",
    });
  }

  res.json({
    success: true,
    message: "Lay chi tiet tac gia thanh cong",
    data: tacGia,
  });
};

const themTacGia = async (req, res) => {
  const { ho_ten, ngay_sinh, sdt, dia_chi, tieu_su } = req.body;

  if (!ho_ten) {
    return res.status(400).json({
      success: false,
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
  res.status(201).json({
    success: true,
    message: "Them tac gia thanh cong",
    data: tacGia,
  });
};

const xoaTacGia = async (req, res) => {
  const { id } = req.params;
  const tacGia = await TacGia.findByPk(id);
  if (!tacGia) {
    return res.status(404).json({
      success: false,
      error: "Khong tim thay tac gia",
    });
  }

  const soTranh = await Tranh.count({ where: { tac_gia_id: id } });
  if (soTranh > 0) {
    return res.status(400).json({
      success: false,
      error: `Tác giả còn ${soTranh} tranh, vui lòng chuyển tranh sang danh mục khác trước`,
    });
  }

  try {
    await sequelize.transaction(async (t) => {
      await tacGia.destroy({ transaction: t });

      res.json({
        success: true,
        message: "Xoa tac gia thanh cong",
        data: null,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Xoa danh muc khong thanh cong",
      error: error.message,
    });
  }
};

const capNhatTacGia = async (req, res) => {
  const { ho_ten, ngay_sinh, sdt, dia_chi, tieu_su } = req.body;
  const { id } = req.params;

  const tacGia = await TacGia.findByPk(id);

  if (!ho_ten) {
    return res.status(400).json({
      success: false,
      error: "Ho ten tac gia la bat buoc",
    });
  }

  if (!tacGia) {
    return res.status(404).json({
      success: false,
      error: "Khong tim thay tac gia",
    });
  }

  await tacGia.update({ ho_ten, ngay_sinh, sdt, dia_chi, tieu_su });

  res.json({
    success: true,
    message: "Cap nhat tac gia thanh cong",
    data: tacGia,
  });
};

module.exports = {
  xemTatCaTacGia,
  xemChiTietTacGia,
  themTacGia,
  xoaTacGia,
  capNhatTacGia,
};
