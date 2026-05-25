const { ThongBao } = require("../models");

const xemThongBaoCuaToi = async (req, res) => {
  const where = {};

  if (req.user.khach_hang_id) where.khach_hang_id = req.user.khach_hang_id;
  if (req.user.nhan_vien_id) where.nhan_vien_id = req.user.nhan_vien_id;

  const danhSach = await ThongBao.findAll({
    where,
    order: [["tao_luc", "DESC"]],
  });

  res.json({
    success: true,
    message: "Lay thong bao thanh cong",
    data: danhSach,
  });
};

const demThongBaoChuaDoc = async (req, res) => {
  const where = { da_doc: false };

  if (req.user.khach_hang_id) where.khach_hang_id = req.user.khach_hang_id;
  if (req.user.nhan_vien_id) where.nhan_vien_id = req.user.nhan_vien_id;

  const total = await ThongBao.count({ where });

  res.json({
    success: true,
    message: "Dem thong bao chua doc thanh cong",
    data: { total },
  });
};

const danhDauDaDoc = async (req, res) => {
  const { id } = req.params;
  const where = { id };

  if (req.user.khach_hang_id) where.khach_hang_id = req.user.khach_hang_id;
  if (req.user.nhan_vien_id) where.nhan_vien_id = req.user.nhan_vien_id;

  const thongBao = await ThongBao.findOne({ where });

  if (!thongBao) {
    return res
      .status(404)
      .json({ success: false, error: "Khong tim thay thong bao" });
  }

  await thongBao.update({ da_doc: true });

  res.json({
    success: true,
    message: "Danh dau da doc thanh cong",
    data: thongBao,
  });
};

const danhDauTatCaDaDoc = async (req, res) => {
  const where = {};

  if (req.user.khach_hang_id) where.khach_hang_id = req.user.khach_hang_id;
  if (req.user.nhan_vien_id) where.nhan_vien_id = req.user.nhan_vien_id;

  await ThongBao.update({ da_doc: true }, { where });

  res.json({
    success: true,
    message: "Danh dau tat ca thong bao da doc thanh cong",
    data: null,
  });
};

const taoThongBao = async ({
  khach_hang_id = null,
  nhan_vien_id = null,
  tieu_de,
  noi_dung,
  loai = "he_thong",
  lien_ket_loai = null,
  lien_ket_id = null,
}) => {
  return ThongBao.create({
    khach_hang_id,
    nhan_vien_id,
    tieu_de,
    noi_dung,
    loai,
    lien_ket_loai,
    lien_ket_id,
  });
};

module.exports = {
  xemThongBaoCuaToi,
  demThongBaoChuaDoc,
  danhDauDaDoc,
  danhDauTatCaDaDoc,
  taoThongBao,
};
