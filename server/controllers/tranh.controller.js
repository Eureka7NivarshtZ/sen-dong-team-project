const { Tranh, HinhAnhTranh, TacGia, DanhMuc, KhoHang } = require("../models");

const xemTatCaTranh = async (req, res) => {
  const danhSachTranh = await Tranh.findAll({
    include: [
      {
        model: HinhAnhTranh,
        as: "hinh_anh",
        separate: true,
        order: [
          ["la_chinh", "DESC"],
          ["thu_tu", "ASC"],
        ],
      },
      { model: TacGia, as: "tac_gia" },
      { model: DanhMuc, as: "danh_muc" },
      { model: KhoHang, as: "kho_hang" },
    ],
    order: [["tao_luc", "DESC"]],
  });

  res.json(danhSachTranh);
};

const xemChiTietTranh = async (req, res) => {
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
  const { danh_muc_id, tac_gia_id } = req.body;

  if (danh_muc_id) {
    const danhMuc = await DanhMuc.findByPk(danh_muc_id);

    if (!danhMuc) {
      return res.status(400).json({
        error: "Danh muc khong ton tai",
      });
    }
  }

  if (tac_gia_id) {
    const tacGia = await TacGia.findByPk(tac_gia_id);

    if (!tacGia) {
      return res.status(400).json({
        error: "Tac gia khong ton tai",
      });
    }
  }

  const tranhData = {
    ...req.body,
    nhan_vien_tao_id: req.user.nhan_vien_id,
    nhan_vien_cap_nhat_id: req.user.nhan_vien_id,
  };

  const tranh = await Tranh.create(tranhData);
  res.status(201).json(tranh);
};

const capNhatTranh = async (req, res) => {
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
};

const anTranh = async (req, res) => {
  const { id } = req.params;

  const tranh = await Tranh.findByPk(id);

  if (!tranh) {
    return res.status(404).json({
      error: "Khong tim thay tranh",
    });
  }

  const tranhData = {
    ...req.body,
    trang_thai: "an",
    nhan_vien_cap_nhat_id: req.user.nhan_vien_id,
    cap_nhat_luc: new Date(),
  };

  await Tranh.update(tranhData);
  res.json(tranh);
};

const xoaTranh = async (req, res) => {
  const { id } = req.params;

  const tranh = await Tranh.findByPk(id);

  if (!tranh) {
    return res.status(404).json({
      error: "Khong tim thay tranh",
    });
  }

  await tranh.destroy();

  res.status(204).end();
};

module.exports = {
  xemTatCaTranh,
  xemChiTietTranh,
  taoTranh,
  capNhatTranh,
  anTranh,
  xoaTranh,
};
