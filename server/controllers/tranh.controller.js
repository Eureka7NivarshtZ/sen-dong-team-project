const { Tranh, HinhAnhTranh, TacGia, DanhMuc, KhoHang } = require("../models");

const layTatCaTranh = async (req, res) => {
  const danhSachTranh = await Tranh.findAll({
    include: [
      { model: HinhAnhTranh, as: "hinh_anh" },
      { model: TacGia, as: "tac_gia" },
      { model: DanhMuc, as: "danh_muc" },
      { model: KhoHang, as: "kho_hang" },
    ],
    order: [["tao_luc", "DESC"]],
  });

  res.json({
    success: true,
    data: danhSachTranh,
  });
};

const taoTranh = async (req, res) => {
  const tranh = await Tranh.create(req.body);
  res.status(201).json({
    success: true,
    message: "Tao tranh thanh cong",
    data: tranh,
  });
};

module.exports = { layTatCaTranh, taoTranh };
