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

  res.json(danhSachTranh);
};

const layChiTietTranh = async (req, res) => {
  const { id } = req.params;

  const tranh = await Tranh.findByPk(id, {
    include: [{ model: HinhAnhTranh, as: "hinh_anh" }],
  });

  if (!tranh) {
    return res.status(400).json({
      error: "Khong tim thay tranh",
    });
  }

  res.json(tranh);
};

const taoTranh = async (req, res) => {
  try {
    const tranhData = {
      ...req.body,
      nhan_vien_tao_id: req.user.nhan_vien_id,
      nhan_vien_cap_nhat_id: req.user.nhan_vien_id,
    };

    const tranh = await Tranh.create(tranhData);
    res.status(201).json(tranh);
  } catch (error) {
    res.status(400).json({
      error: "Khong the tao tranh",
      chi_tiet: error.message,
    });
  }
};

const capNhatTranh = async (req, res) => {
  try {
    const { id } = req.params;

    const tranh = await Tranh.findByPk(id);

    if (!tranh) {
      return res.status(404).json({
        error: "Khong tim thay tranh",
      });
    }

    const tranhData = {
      ...req.body,
      nhan_vien_cap_nhat_id: req.user.nhan_vien_id,
      cap_nhat_luc: new Date(),
    };

    await tranh.update(tranhData);

    res.json(tranh);
  } catch (error) {
    res.status(400).json({
      error: "Khong the cap nhat tranh",
      chi_tiet: error.message,
    });
  }
};

const xoaTranh = async (req, res) => {
  try {
    const { id } = req.params;

    const tranh = await Tranh.findByPk(id);

    if (!tranh) {
      return res.status(404).json({
        error: "Khong tim thay tranh",
      });
    }

    await tranh.destroy();

    res.status(200).json({
      message: "Tranh da duoc xoa thanh cong",
      id: id,
    });
  } catch (error) {
    res.status(400).json({
      error: "Khong the xoa tranh",
      chi_tiet: error.message,
    });
  }
};

module.exports = {
  layTatCaTranh,
  layChiTietTranh,
  taoTranh,
  capNhatTranh,
  xoaTranh,
};
