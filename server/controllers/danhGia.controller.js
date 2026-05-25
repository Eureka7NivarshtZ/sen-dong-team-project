const {
  DanhGia,
  Tranh,
  DonHang,
  DonHangChiTiet,
  KhachHang,
  NhanVien,
} = require("../models");

const xemDanhGiaTheoTranh = async (req, res) => {
  const { tranhId } = req.params;

  const danhSachDanhGia = await DanhGia.findAll({
    where: { tranh_id: tranhId, trang_thai: "hien" },
    include: [
      { model: KhachHang, as: "khach_hang", attributes: ["id", "ho_ten"] },
      {
        model: NhanVien,
        as: "nhan_vien_phan_hoi",
        attributes: ["id", "ho_ten"],
      },
    ],
    order: [["tao_luc", "DESC"]],
  });

  res.json({
    success: true,
    message: "Lay danh gia san pham thanh cong",
    data: danhSachDanhGia,
  });
};

const taoDanhGia = async (req, res) => {
  const { tranh_id, don_hang_id, so_sao, noi_dung, hinh_anh_url } = req.body;
  const khach_hang_id = req.user.khach_hang_id;

  if (!khach_hang_id) {
    return res
      .status(403)
      .json({ success: false, error: "Chi khach hang moi duoc danh gia" });
  }

  if (!tranh_id || !don_hang_id || !so_sao) {
    return res.status(400).json({
      success: false,
      error: "Vui long nhap tranh_id, don_hang_id va so_sao",
    });
  }

  if (Number(so_sao) < 1 || Number(so_sao) > 5) {
    return res
      .status(400)
      .json({ success: false, error: "So sao phai tu 1 den 5" });
  }

  const tranh = await Tranh.findByPk(tranh_id);
  if (!tranh) {
    return res
      .status(404)
      .json({ success: false, error: "Khong tim thay tranh" });
  }

  const donHang = await DonHang.findOne({
    where: { id: don_hang_id, khach_hang_id, trang_thai: "hoan_thanh" },
  });

  if (!donHang) {
    return res.status(400).json({
      success: false,
      error: "Chi duoc danh gia san pham trong don hang da hoan thanh",
    });
  }

  const chiTiet = await DonHangChiTiet.findOne({
    where: { don_hang_id, tranh_id },
  });
  if (!chiTiet) {
    return res.status(400).json({
      success: false,
      error: "San pham nay khong nam trong don hang cua ban",
    });
  }

  const daDanhGia = await DanhGia.findOne({
    where: { khach_hang_id, tranh_id, don_hang_id },
  });

  if (daDanhGia) {
    return res.status(400).json({
      success: false,
      error: "Ban da danh gia san pham nay roi",
    });
  }

  const danhGia = await DanhGia.create({
    khach_hang_id,
    tranh_id,
    don_hang_id,
    so_sao,
    noi_dung,
    hinh_anh_url,
    trang_thai: "cho_duyet",
  });

  res.status(201).json({
    success: true,
    message: "Gui danh gia thanh cong, vui long cho duyet",
    data: danhGia,
  });
};

const xemDanhGiaCuaToi = async (req, res) => {
  const khach_hang_id = req.user.khach_hang_id;

  const danhSachDanhGia = await DanhGia.findAll({
    where: { khach_hang_id },
    include: [
      { model: Tranh, as: "tranh", attributes: ["id", "ten_tranh", "gia_ban"] },
    ],
    order: [["tao_luc", "DESC"]],
  });

  res.json({
    success: true,
    message: "Lay danh gia cua toi thanh cong",
    data: danhSachDanhGia,
  });
};

const adminXemTatCaDanhGia = async (req, res) => {
  const { trang_thai } = req.query;
  const where = {};
  if (trang_thai) where.trang_thai = trang_thai;

  const danhSachDanhGia = await DanhGia.findAll({
    where,
    include: [
      { model: KhachHang, as: "khach_hang", attributes: ["id", "ho_ten"] },
      { model: Tranh, as: "tranh", attributes: ["id", "ten_tranh"] },
    ],
    order: [["tao_luc", "DESC"]],
  });

  res.json({
    success: true,
    message: "Lay danh sach danh gia thanh cong",
    data: danhSachDanhGia,
  });
};

const adminCapNhatTrangThaiDanhGia = async (req, res) => {
  const { id } = req.params;
  const { trang_thai } = req.body;

  if (!["cho_duyet", "hien", "an"].includes(trang_thai)) {
    return res
      .status(400)
      .json({ success: false, error: "Trang thai khong hop le" });
  }

  const danhGia = await DanhGia.findByPk(id);
  if (!danhGia) {
    return res
      .status(404)
      .json({ success: false, error: "Khong tim thay danh gia" });
  }

  await danhGia.update({ trang_thai });

  res.json({
    success: true,
    message: "Cap nhat trang thai danh gia thanh cong",
    data: danhGia,
  });
};

const adminPhanHoiDanhGia = async (req, res) => {
  const { id } = req.params;
  const { phan_hoi } = req.body;

  const danhGia = await DanhGia.findByPk(id);
  if (!danhGia) {
    return res
      .status(404)
      .json({ success: false, error: "Khong tim thay danh gia" });
  }

  await danhGia.update({
    phan_hoi,
    nhan_vien_phan_hoi_id: req.user.nhan_vien_id,
  });

  res.json({
    success: true,
    message: "Phan hoi danh gia thanh cong",
    data: danhGia,
  });
};

module.exports = {
  xemDanhGiaTheoTranh,
  taoDanhGia,
  xemDanhGiaCuaToi,
  adminXemTatCaDanhGia,
  adminCapNhatTrangThaiDanhGia,
  adminPhanHoiDanhGia,
};
