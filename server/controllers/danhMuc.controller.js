const {
  DanhMuc,
  sequelize,
  DanhGia,
  KhuyenMaiDanhMuc,
  Tranh,
} = require("../models");

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

  const soTranh = await Tranh.count({ where: { danh_muc_id: id } });
  if (soTranh > 0) {
    return res.status(400).json({
      success: false,
      error: `Danh mục còn ${soTranh} tranh, vui lòng chuyển tranh sang danh mục khác trước`,
    });
  }

  try {
    await sequelize.transaction(async (t) => {
      await DanhMuc.update(
        { cha_id: null },
        { where: { cha_id: id }, transaction: t },
      );

      await KhuyenMaiDanhMuc.destroy({
        where: { danh_muc_id: id },
        transaction: t,
      });

      await danhMuc.destroy({ transaction: t });
    });

    res.json({
      success: true,
      message: "Xoa danh muc thanh cong",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Xoa danh muc khong thanh cong",
      error: error.message,
    });
  }
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
