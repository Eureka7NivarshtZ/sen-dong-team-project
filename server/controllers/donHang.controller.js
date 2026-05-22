const {
  KhachHang,
  NhanVien,
  DonHang,
  DonViVanChuyen,
  DonHangChiTiet,
  Tranh,
  HoaDon,
  ThanhToan,
  sequelize,
  GioHang,
  GioHangChiTiet,
} = require("../models");
const { Op } = require("sequelize");

// Khách hàng
const taoDonHang = async (req, res) => {
  const { dia_chi_giao, don_vi_van_chuyen_id, ghi_chu } = req.body;
  const khachHangId = req.user.khach_hang_id;

  if (!khachHangId) {
    return res.status(401).json({
      success: false,
      error: "Token khong hop le hoac khong phai khach hang",
    });
  }

  if (!dia_chi_giao) {
    return res.status(400).json({
      success: false,
      error: "Dia chi giao la bat buoc",
    });
  }

  const ketQua = await sequelize.transaction(async (t) => {
    const gioHang = await GioHang.findOne({
      where: {
        khach_hang_id: khachHangId,
      },
      transaction: t,
    });

    if (!gioHang) {
      throw new Error("Gio hang dang trong");
    }

    const chiTietGioHang = await GioHangChiTiet.findAll({
      where: {
        gio_hang_id: gioHang.id,
      },
      include: [
        {
          model: Tranh,
          as: "tranh",
        },
      ],
      transaction: t,
    });

    if (chiTietGioHang.length === 0) {
      throw new Error("Gio hang dang trong");
    }

    let tongTienHang = 0;

    for (const item of chiTietGioHang) {
      const tranh = item.tranh;
      const soLuongMua = Number(item.so_luong);

      if (!tranh) {
        throw new Error("Co tranh trong gio hang khong ton tai");
      }

      if (tranh.trang_thai !== "ban") {
        throw new Error(`Tranh "${tranh.ten_tranh}" hien khong duoc ban`);
      }

      if (Number(tranh.so_luong_ton) < soLuongMua) {
        throw new Error(`Tranh "${tranh.ten_tranh}" khong du so luong ton`);
      }

      tongTienHang += soLuongMua * Number(tranh.gia_ban);
    }

    let phiVanChuyen = 0;
    let donViVanChuyenId = null;

    if (don_vi_van_chuyen_id) {
      const donViVanChuyen = await DonViVanChuyen.findByPk(
        don_vi_van_chuyen_id,
        {
          transaction: t,
        },
      );

      if (!donViVanChuyen) {
        throw new Error("Don vi van chuyen khong ton tai");
      }

      if (!donViVanChuyen.hoat_dong) {
        throw new Error("Don vi van chuyen hien khong hoat dong");
      }

      phiVanChuyen = Number(donViVanChuyen.phi_co_ban);
      donViVanChuyenId = donViVanChuyen.id;
    }

    const maDonHang = `DH-${Date.now()}`;

    const donHang = await DonHang.create(
      {
        khach_hang_id: khachHangId,
        nhan_vien_id: null,
        don_vi_van_chuyen_id: donViVanChuyenId,
        ma_don_hang: maDonHang,
        dia_chi_giao,
        tong_tien_hang: tongTienHang,
        phi_van_chuyen: phiVanChuyen,
        giam_gia: 0,
        trang_thai: "cho_xac_nhan",
        ghi_chu,
      },
      {
        transaction: t,
      },
    );

    const duLieuChiTietDonHang = chiTietGioHang.map((item) => {
      return {
        don_hang_id: donHang.id,
        tranh_id: item.tranh_id,
        so_luong: item.so_luong,
        don_gia: item.tranh.gia_ban,
        co_lap_khung: false,
      };
    });

    await DonHangChiTiet.bulkCreate(duLieuChiTietDonHang, {
      transaction: t,
    });

    for (const item of chiTietGioHang) {
      const tranh = item.tranh;
      const soLuongConLai = Number(tranh.so_luong_ton) - Number(item.so_luong);

      await tranh.update(
        {
          so_luong_ton: soLuongConLai,
          trang_thai: soLuongConLai === 0 ? "het_hang" : tranh.trang_thai,
        },
        {
          transaction: t,
        },
      );
    }

    await GioHangChiTiet.destroy({
      where: {
        gio_hang_id: gioHang.id,
      },
      transaction: t,
    });

    const donHangDayDu = await DonHang.findByPk(donHang.id, {
      include: [
        {
          model: DonHangChiTiet,
          as: "chi_tiet",
          include: [
            {
              model: Tranh,
              as: "tranh",
            },
          ],
        },
        {
          model: DonViVanChuyen,
          as: "don_vi_van_chuyen",
        },
      ],
      transaction: t,
    });

    return donHangDayDu;
  });

  return res.status(201).json({
    success: true,
    message: "Tao don hang thanh cong",
    data: ketQua,
  });
};

const xemDonCuaToi = async (req, res) => {
  const khachHangId = req.user.khach_hang_id;

  const danhSach = await DonHang.findAll({
    where: { khach_hang_id: khachHangId },
    include: [
      {
        model: DonHangChiTiet,
        as: "chi_tiet",
        include: [{ model: Tranh, as: "tranh" }],
      },
      { model: NhanVien, as: "nhan_vien" },
      { model: DonViVanChuyen, as: "don_vi_van_chuyen" },
    ],
    order: [["ngay_dat", "DESC"]],
  });

  res.json({
    success: true,
    message: "Lay don hang cua toi thanh cong",
    data: danhSach,
  });
};

const xemChiTietDonCuaToi = async (req, res) => {
  const { id } = req.params;
  const khachHangId = req.user.khach_hang_id;

  const donHang = await DonHang.findOne({
    where: { id, khach_hang_id: khachHangId },
    include: [
      {
        model: DonHangChiTiet,
        as: "chi_tiet",
        include: [{ model: Tranh, as: "tranh" }],
      },
      { model: NhanVien, as: "nhan_vien" },
      { model: DonViVanChuyen, as: "don_vi_van_chuyen" },
      {
        model: HoaDon,
        as: "hoa_don",
        include: [{ model: ThanhToan, as: "thanh_toan" }],
      },
    ],
  });

  if (!donHang) {
    return res.status(404).json({
      success: false,
      error: "Không tìm thấy đơn hàng",
    });
  }

  res.json({
    success: true,
    message: "Lay chi tiet don hang thanh cong",
    data: donHang,
  });
};

const huyDonCuaToi = async (req, res) => {
  const { id } = req.params;
  const khachHangId = req.user.khach_hang_id;

  const donHang = await DonHang.findOne({
    where: { id, khach_hang_id: khachHangId },
  });

  if (!donHang) {
    return res.status(404).json({
      success: false,
      error: "Không tìm thấy đơn hàng",
    });
  }

  if (!["cho_xac_nhan", "dang_chuan_bi"].includes(donHang.trang_thai)) {
    return res.status(400).json({
      success: false,
      error: "Không thể hủy đơn hàng ở trạng thái này",
    });
  }

  await donHang.update({ trang_thai: "huy" });

  res.json({
    success: true,
    message: "Huy don hang thanh cong",
    data: donHang,
  });
};

// Quản lý
const xemTatCaDonHang = async (req, res) => {
  const { trang_thai, search, page = 1, limit = 10 } = req.query;

  let whereCondition = {};

  if (trang_thai) {
    whereCondition.trang_thai = trang_thai;
  }

  const danhSach = await DonHang.findAndCountAll({
    where: whereCondition,
    include: [
      { model: KhachHang, as: "khach_hang" },
      { model: NhanVien, as: "nhan_vien" },
      { model: DonViVanChuyen, as: "don_vi_van_chuyen" },
    ],
    order: [["ngay_dat", "DESC"]],
    offset: (page - 1) * limit,
    limit: parseInt(limit),
  });

  res.json({
    success: true,
    message: "Lay tat ca don hang thanh cong",
    data: danhSach.rows,
    total: danhSach.count,
    page: parseInt(page),
    limit: parseInt(limit),
  });
};

const xemChiTietDonBatKy = async (req, res) => {
  const { id } = req.params;

  const donHang = await DonHang.findByPk(id, {
    include: [
      {
        model: DonHangChiTiet,
        as: "don_hang_chi_tiet",
        include: [{ model: Tranh, as: "tranh" }],
      },
      { model: KhachHang, as: "khach_hang" },
      { model: NhanVien, as: "nhan_vien" },
      { model: DonViVanChuyen, as: "don_vi_van_chuyen" },
      { model: HoaDon, as: "hoa_don" },
    ],
  });

  if (!donHang) {
    return res.status(404).json({
      success: false,
      error: "Không tìm thấy đơn hàng",
    });
  }

  res.json({
    success: true,
    message: "Lay chi tiet don hang thanh cong",
    data: donHang,
  });
};

const capNhatTrangThaiDon = async (req, res) => {
  const { id } = req.params;
  const { trang_thai } = req.body;

  const trangThaiHopLe = [
    "cho_xac_nhan",
    "dang_chuan_bi",
    "dang_giao",
    "hoan_thanh",
    "huy",
  ];

  if (!trangThaiHopLe.includes(trang_thai)) {
    return res.status(400).json({
      success: false,
      error: "Trang thai khong hop le",
    });
  }

  const donHang = await DonHang.findByPk(id);

  if (!donHang) {
    return res.status(404).json({
      success: false,
      error: "Khong tim thay don hang",
    });
  }

  await donHang.update({
    trang_thai,
    nhan_vien_id: req.user.nhan_vien_id,
  });

  res.json({
    success: true,
    message: "Cap nhat trang thai don hang thanh cong",
    data: donHang,
  });
};

const huyDonBatKy = async (req, res) => {
  const { id } = req.params;

  const donHang = await DonHang.findByPk(id);

  if (!donHang) {
    return res.status(404).json({
      success: false,
      error: "Không tìm thấy đơn hàng",
    });
  }

  if (!["cho_xac_nhan", "dang_chuan_bi"].includes(donHang.trang_thai)) {
    return res.status(400).json({
      success: false,
      error: "Không thể hủy đơn hàng ở trạng thái này",
    });
  }

  await donHang.update({ trang_thai: "huy" });

  res.json({
    success: true,
    message: "Huy don hang thanh cong",
    data: donHang,
  });
};

module.exports = {
  taoDonHang,
  xemDonCuaToi,
  xemChiTietDonCuaToi,
  huyDonCuaToi,
  xemTatCaDonHang,
  xemChiTietDonBatKy,
  capNhatTrangThaiDon,
  huyDonBatKy,
};
