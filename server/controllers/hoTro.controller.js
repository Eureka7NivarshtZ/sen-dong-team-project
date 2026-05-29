const {
  YeuCauHoTro,
  PhanHoiHoTro,
  KhachHang,
  NhanVien,
  DonHang,
} = require("../models");

const taoYeuCauHoTro = async (req, res) => {
  const khach_hang_id = req.user.khach_hang_id;
  const {
    don_hang_id,
    tieu_de,
    noi_dung,
    loai = "khac",
    muc_do = "binh_thuong",
    trang_thai = "moi",
  } = req.body;

  if (!khach_hang_id) {
    return res.status(403).json({
      success: false,
      error: "Chi khach hang moi duoc tao yeu cau ho tro",
    });
  }

  if (!tieu_de || !noi_dung) {
    return res
      .status(400)
      .json({ success: false, error: "Vui long nhap tieu_de va noi_dung" });
  }

  if (don_hang_id) {
    const donHang = await DonHang.findOne({
      where: { id: don_hang_id, khach_hang_id },
    });
    if (!donHang) {
      return res
        .status(404)
        .json({ success: false, error: "Khong tim thay don hang cua ban" });
    }
  }

  const yeuCau = await YeuCauHoTro.create({
    khach_hang_id,
    don_hang_id,
    tieu_de,
    noi_dung,
    loai,
    muc_do,
  });

  await PhanHoiHoTro.create({
    yeu_cau_ho_tro_id: yeuCau.id,
    nguoi_gui_loai: "khach_hang",
    khach_hang_id,
    noi_dung,
  });

  res.status(201).json({
    success: true,
    message: "Tao yeu cau ho tro thanh cong",
    data: yeuCau,
  });
};

const xemYeuCauHoTroCuaToi = async (req, res) => {
  const khach_hang_id = req.user.khach_hang_id;

  const danhSach = await YeuCauHoTro.findAll({
    where: { khach_hang_id },
    order: [["tao_luc", "DESC"]],
  });

  res.json({
    success: true,
    message: "Lay yeu cau ho tro cua toi thanh cong",
    data: danhSach,
  });
};

const xemChiTietYeuCauHoTro = async (req, res) => {
  const { id } = req.params;
  const khach_hang_id = req.user.khach_hang_id;
  const nhan_vien_id = req.user.nhan_vien_id;

  const where = { id };
  if (khach_hang_id) where.khach_hang_id = khach_hang_id;

  const yeuCau = await YeuCauHoTro.findOne({
    where,
    include: [
      {
        model: KhachHang,
        as: "khach_hang",
        attributes: ["id", "ho_ten", "sdt"],
      },
      {
        model: NhanVien,
        as: "nhan_vien_phu_trach",
        attributes: ["id", "ho_ten"],
      },
      {
        model: PhanHoiHoTro,
        as: "phan_hoi",
        include: [
          { model: KhachHang, as: "khach_hang", attributes: ["id", "ho_ten"] },
          { model: NhanVien, as: "nhan_vien", attributes: ["id", "ho_ten"] },
        ],
      },
    ],
    order: [[{ model: PhanHoiHoTro, as: "phan_hoi" }, "tao_luc", "ASC"]],
  });

  if (!yeuCau) {
    return res
      .status(404)
      .json({ success: false, error: "Khong tim thay yeu cau ho tro" });
  }

  res.json({
    success: true,
    message: "Lay chi tiet yeu cau ho tro thanh cong",
    data: yeuCau,
  });
};

const khachHangPhanHoiHoTro = async (req, res) => {
  const { id } = req.params;
  const { noi_dung, tep_dinh_kem_url } = req.body;
  const khach_hang_id = req.user.khach_hang_id;

  const yeuCau = await YeuCauHoTro.findOne({ where: { id, khach_hang_id } });
  if (!yeuCau) {
    return res
      .status(404)
      .json({ success: false, error: "Khong tim thay yeu cau ho tro" });
  }

  const phanHoi = await PhanHoiHoTro.create({
    yeu_cau_ho_tro_id: id,
    nguoi_gui_loai: "khach_hang",
    khach_hang_id,
    noi_dung,
    tep_dinh_kem_url,
  });

  await yeuCau.update({ trang_thai: "moi" });

  res.status(201).json({
    success: true,
    message: "Gui phan hoi thanh cong",
    data: phanHoi,
  });
};

const adminXemTatCaYeuCauHoTro = async (req, res) => {
  const { trang_thai, loai, muc_do } = req.query;
  const where = {};

  if (trang_thai) where.trang_thai = trang_thai;
  if (loai) where.loai = loai;
  if (muc_do) where.muc_do = muc_do;

  const danhSach = await YeuCauHoTro.findAll({
    where,
    include: [
      {
        model: KhachHang,
        as: "khach_hang",
        attributes: ["id", "ho_ten", "sdt"],
      },
      {
        model: NhanVien,
        as: "nhan_vien_phu_trach",
        attributes: ["id", "ho_ten"],
      },
    ],
    order: [["tao_luc", "DESC"]],
  });

  res.json({
    success: true,
    message: "Lay danh sach yeu cau ho tro thanh cong",
    data: danhSach,
  });
};

const adminCapNhatYeuCauHoTro = async (req, res) => {
  const { id } = req.params;
  const { trang_thai, muc_do, nhan_vien_phu_trach_id } = req.body;

  const yeuCau = await YeuCauHoTro.findByPk(id);
  if (!yeuCau) {
    return res
      .status(404)
      .json({ success: false, error: "Khong tim thay yeu cau ho tro" });
  }

  await yeuCau.update({
    trang_thai: trang_thai ?? yeuCau.trang_thai,
    muc_do: muc_do ?? yeuCau.muc_do,
    nhan_vien_phu_trach_id: nhan_vien_phu_trach_id ?? req.user.nhan_vien_id,
  });

  res.json({
    success: true,
    message: "Cap nhat yeu cau ho tro thanh cong",
    data: yeuCau,
  });
};

const adminPhanHoiHoTro = async (req, res) => {
  const { id } = req.params;
  const { noi_dung, tep_dinh_kem_url } = req.body;

  const yeuCau = await YeuCauHoTro.findByPk(id);
  if (!yeuCau) {
    return res
      .status(404)
      .json({ success: false, error: "Khong tim thay yeu cau ho tro" });
  }

  const phanHoi = await PhanHoiHoTro.create({
    yeu_cau_ho_tro_id: id,
    nguoi_gui_loai: "nhan_vien",
    nhan_vien_id: req.user.nhan_vien_id,
    noi_dung,
    tep_dinh_kem_url,
  });

  await yeuCau.update({
    trang_thai: "da_phan_hoi",
    nhan_vien_phu_trach_id: req.user.nhan_vien_id,
  });

  res.status(201).json({
    success: true,
    message: "Nhan vien phan hoi ho tro thanh cong",
    data: phanHoi,
  });
};

module.exports = {
  taoYeuCauHoTro,
  xemYeuCauHoTroCuaToi,
  xemChiTietYeuCauHoTro,
  khachHangPhanHoiHoTro,
  adminXemTatCaYeuCauHoTro,
  adminCapNhatYeuCauHoTro,
  adminPhanHoiHoTro,
};
