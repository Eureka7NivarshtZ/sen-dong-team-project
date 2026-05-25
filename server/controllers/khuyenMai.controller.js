const {
  KhuyenMai,
  KhuyenMaiTranh,
  KhuyenMaiDanhMuc,
  LichSuSuDungKhuyenMai,
  GioHang,
  GioHangChiTiet,
  Tranh,
  DanhMuc,
} = require("../models");
const { Op } = require("sequelize");

const tinhSoTienGiam = (khuyenMai, tongTien) => {
  const giaTriGiam = Number(khuyenMai.gia_tri_giam);
  const giamToiDa = khuyenMai.giam_toi_da
    ? Number(khuyenMai.giam_toi_da)
    : null;

  let soTienGiam = 0;

  if (khuyenMai.loai_giam === "phan_tram") {
    soTienGiam = (Number(tongTien) * giaTriGiam) / 100;
    if (giamToiDa !== null) soTienGiam = Math.min(soTienGiam, giamToiDa);
  }

  if (khuyenMai.loai_giam === "so_tien") {
    soTienGiam = giaTriGiam;
  }

  return Math.min(soTienGiam, Number(tongTien));
};

const kiemTraKhuyenMaiHopLe = async (khuyenMai, khach_hang_id, tongTien) => {
  const hienTai = new Date();

  if (!khuyenMai) return "Ma khuyen mai khong ton tai";
  if (khuyenMai.trang_thai !== "hoat_dong")
    return "Ma khuyen mai khong hoat dong";
  if (new Date(khuyenMai.ngay_bat_dau) > hienTai)
    return "Ma khuyen mai chua bat dau";
  if (new Date(khuyenMai.ngay_ket_thuc) < hienTai)
    return "Ma khuyen mai da het han";
  if (Number(tongTien) < Number(khuyenMai.don_toi_thieu))
    return "Don hang chua dat gia tri toi thieu";

  if (khuyenMai.so_luong !== null && khuyenMai.so_luong !== undefined) {
    if (Number(khuyenMai.so_luong_da_dung) >= Number(khuyenMai.so_luong)) {
      return "Ma khuyen mai da het luot su dung";
    }
  }

  const daDung = await LichSuSuDungKhuyenMai.findOne({
    where: { khuyen_mai_id: khuyenMai.id, khach_hang_id },
  });

  if (daDung) return "Ban da su dung ma khuyen mai nay";

  return null;
};

const adminTaoKhuyenMai = async (req, res) => {
  const {
    ma,
    ten,
    mo_ta,
    loai_giam,
    gia_tri_giam,
    giam_toi_da,
    don_toi_thieu,
    so_luong,
    ngay_bat_dau,
    ngay_ket_thuc,
    ap_dung_cho = "toan_bo",
    tranh_ids = [],
    danh_muc_ids = [],
  } = req.body;

  if (
    !ma ||
    !ten ||
    !loai_giam ||
    !gia_tri_giam ||
    !ngay_bat_dau ||
    !ngay_ket_thuc
  ) {
    return res
      .status(400)
      .json({
        success: false,
        error: "Vui long nhap day du thong tin khuyen mai",
      });
  }

  const khuyenMai = await KhuyenMai.create({
    ma: ma.toUpperCase(),
    ten,
    mo_ta,
    loai_giam,
    gia_tri_giam,
    giam_toi_da,
    don_toi_thieu,
    so_luong,
    ngay_bat_dau,
    ngay_ket_thuc,
    ap_dung_cho,
    nhan_vien_tao_id: req.user.nhan_vien_id,
  });

  if (ap_dung_cho === "tranh" && Array.isArray(tranh_ids)) {
    await KhuyenMaiTranh.bulkCreate(
      tranh_ids.map((tranh_id) => ({ khuyen_mai_id: khuyenMai.id, tranh_id })),
    );
  }

  if (ap_dung_cho === "danh_muc" && Array.isArray(danh_muc_ids)) {
    await KhuyenMaiDanhMuc.bulkCreate(
      danh_muc_ids.map((danh_muc_id) => ({
        khuyen_mai_id: khuyenMai.id,
        danh_muc_id,
      })),
    );
  }

  res.status(201).json({
    success: true,
    message: "Tao khuyen mai thanh cong",
    data: khuyenMai,
  });
};

const adminXemTatCaKhuyenMai = async (req, res) => {
  const { trang_thai, keyword } = req.query;
  const where = {};

  if (trang_thai) where.trang_thai = trang_thai;
  if (keyword) {
    where[Op.or] = [
      { ma: { [Op.like]: `%${keyword}%` } },
      { ten: { [Op.like]: `%${keyword}%` } },
    ];
  }

  const danhSach = await KhuyenMai.findAll({
    where,
    order: [["tao_luc", "DESC"]],
  });

  res.json({
    success: true,
    message: "Lay danh sach khuyen mai thanh cong",
    data: danhSach,
  });
};

const adminXemChiTietKhuyenMai = async (req, res) => {
  const { id } = req.params;

  const khuyenMai = await KhuyenMai.findByPk(id, {
    include: [
      { model: Tranh, as: "tranh_ap_dung", through: { attributes: [] } },
      { model: DanhMuc, as: "danh_muc_ap_dung", through: { attributes: [] } },
    ],
  });

  if (!khuyenMai) {
    return res
      .status(404)
      .json({ success: false, error: "Khong tim thay khuyen mai" });
  }

  res.json({
    success: true,
    message: "Lay chi tiet khuyen mai thanh cong",
    data: khuyenMai,
  });
};

const adminCapNhatKhuyenMai = async (req, res) => {
  const { id } = req.params;
  const khuyenMai = await KhuyenMai.findByPk(id);

  if (!khuyenMai) {
    return res
      .status(404)
      .json({ success: false, error: "Khong tim thay khuyen mai" });
  }

  const data = { ...req.body };
  if (data.ma) data.ma = data.ma.toUpperCase();

  await khuyenMai.update(data);

  res.json({
    success: true,
    message: "Cap nhat khuyen mai thanh cong",
    data: khuyenMai,
  });
};

const adminXoaKhuyenMai = async (req, res) => {
  const { id } = req.params;
  const khuyenMai = await KhuyenMai.findByPk(id);

  if (!khuyenMai) {
    return res
      .status(404)
      .json({ success: false, error: "Khong tim thay khuyen mai" });
  }

  await khuyenMai.destroy();

  res.json({
    success: true,
    message: "Xoa khuyen mai thanh cong",
    data: null,
  });
};

const kiemTraMaKhuyenMai = async (req, res) => {
  const { ma, tong_tien } = req.body;
  const khach_hang_id = req.user.khach_hang_id;

  if (!ma || !tong_tien) {
    return res
      .status(400)
      .json({ success: false, error: "Vui long nhap ma va tong_tien" });
  }

  const khuyenMai = await KhuyenMai.findOne({
    where: { ma: ma.toUpperCase() },
  });
  const loi = await kiemTraKhuyenMaiHopLe(
    khuyenMai,
    khach_hang_id,
    Number(tong_tien),
  );

  if (loi) {
    return res.status(400).json({ success: false, error: loi });
  }

  const soTienGiam = tinhSoTienGiam(khuyenMai, Number(tong_tien));

  res.json({
    success: true,
    message: "Ma khuyen mai hop le",
    data: {
      khuyen_mai: khuyenMai,
      so_tien_giam: soTienGiam,
      tong_sau_giam: Number(tong_tien) - soTienGiam,
    },
  });
};

module.exports = {
  tinhSoTienGiam,
  kiemTraKhuyenMaiHopLe,
  adminTaoKhuyenMai,
  adminXemTatCaKhuyenMai,
  adminXemChiTietKhuyenMai,
  adminCapNhatKhuyenMai,
  adminXoaKhuyenMai,
  kiemTraMaKhuyenMai,
};
