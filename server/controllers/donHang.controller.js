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

const taoMaDonHang = () => `DH-${Date.now()}`;
const taoSoHoaDon = () => `HD-${Date.now()}`;
const taoMaGiaoDich = () => `GD-${Date.now()}`;

const mapPhuongThucThanhToan = (value) => {
  if (value === "bank") return "chuyen_khoan";
  if (value === "card") return "the";
  return "tien_mat";
};

// ================= KHÁCH HÀNG: TẠO ĐƠN HÀNG =================
const taoDonHang = async (req, res) => {
  const {
    dia_chi_giao,
    don_vi_van_chuyen_id,
    khuyen_mai_id,
    ghi_chu,
    phuong_thuc_thanh_toan = "cod",
  } = req.body;

  const khachHangId = req.user.khach_hang_id;

  if (!khachHangId) {
    return res.status(401).json({
      success: false,
      error: "Token không hợp lệ hoặc không phải khách hàng",
    });
  }

  if (!dia_chi_giao) {
    return res.status(400).json({
      success: false,
      error: "Địa chỉ giao hàng là bắt buộc",
    });
  }

  try {
    const ketQua = await sequelize.transaction(async (t) => {
      const gioHang = await GioHang.findOne({
        where: { khach_hang_id: khachHangId },
        transaction: t,
      });

      if (!gioHang) {
        throw new Error("Giỏ hàng đang trống");
      }

      const chiTietGioHang = await GioHangChiTiet.findAll({
        where: { gio_hang_id: gioHang.id },
        include: [
          {
            model: Tranh,
            as: "tranh",
          },
        ],
        transaction: t,
      });

      if (!chiTietGioHang || chiTietGioHang.length === 0) {
        throw new Error("Giỏ hàng đang trống");
      }

      let tongTienHang = 0;

      for (const item of chiTietGioHang) {
        const tranh = item.tranh;
        const soLuongMua = Number(item.so_luong || 0);

        if (!tranh) {
          throw new Error("Có tranh trong giỏ hàng không tồn tại");
        }

        if (tranh.trang_thai !== "ban") {
          throw new Error(`Tranh "${tranh.ten_tranh}" hiện không được bán`);
        }

        if (Number(tranh.so_luong_ton || 0) < soLuongMua) {
          throw new Error(`Tranh "${tranh.ten_tranh}" không đủ số lượng tồn`);
        }

        tongTienHang += soLuongMua * Number(tranh.gia_ban || 0);
      }

      let phiVanChuyen = 0;
      let donViVanChuyenId = null;

      if (don_vi_van_chuyen_id) {
        const donViVanChuyen = await DonViVanChuyen.findByPk(
          don_vi_van_chuyen_id,
          { transaction: t },
        );

        if (!donViVanChuyen) {
          throw new Error("Đơn vị vận chuyển không tồn tại");
        }

        if (!donViVanChuyen.hoat_dong) {
          throw new Error("Đơn vị vận chuyển hiện không hoạt động");
        }

        phiVanChuyen = Number(donViVanChuyen.phi_co_ban || 0);
        donViVanChuyenId = donViVanChuyen.id;
      } else {
        // Nếu FE chưa chọn đơn vị vận chuyển, dùng phí mặc định.
        phiVanChuyen = 30000;
      }

      const giamGia = 0;
      const tongThanhToan = tongTienHang + phiVanChuyen - giamGia;

      const donHang = await DonHang.create(
        {
          khach_hang_id: khachHangId,
          nhan_vien_id: null,
          don_vi_van_chuyen_id: donViVanChuyenId,
          khuyen_mai_id: khuyen_mai_id || null,
          ma_don_hang: taoMaDonHang(),
          dia_chi_giao,
          tong_tien_hang: tongTienHang,
          phi_van_chuyen: phiVanChuyen,
          giam_gia: giamGia,
          trang_thai: "cho_xac_nhan",
          ghi_chu,
        },
        { transaction: t },
      );

      const duLieuChiTietDonHang = chiTietGioHang.map((item) => ({
        don_hang_id: donHang.id,
        tranh_id: item.tranh_id,
        so_luong: item.so_luong,
        don_gia: item.tranh.gia_ban,
        co_lap_khung: false,
      }));

      await DonHangChiTiet.bulkCreate(duLieuChiTietDonHang, {
        transaction: t,
      });

      for (const item of chiTietGioHang) {
        const tranh = item.tranh;
        const soLuongConLai =
          Number(tranh.so_luong_ton || 0) - Number(item.so_luong || 0);

        await tranh.update(
          {
            so_luong_ton: soLuongConLai,
            trang_thai: soLuongConLai === 0 ? "het_hang" : tranh.trang_thai,
          },
          { transaction: t },
        );
      }

      // ================= TẠO HÓA ĐƠN =================
      const thueSuat = 10;
      const tongTruocThue = Math.round(tongThanhToan / (1 + thueSuat / 100));

      const hoaDon = await HoaDon.create(
        {
          don_hang_id: donHang.id,
          so_hoa_don: taoSoHoaDon(),
          tong_tien_truoc_thue: tongTruocThue,
          thue_suat: thueSuat,
          loai: "ban_hang",
          trang_thai: "da_xuat",
        },
        { transaction: t },
      );

      // ================= TẠO THANH TOÁN =================
      await ThanhToan.create(
        {
          hoa_don_id: hoaDon.id,
          so_tien: tongThanhToan,
          phuong_thuc: mapPhuongThucThanhToan(phuong_thuc_thanh_toan),
          trang_thai: "cho_thanh_toan",
          ma_giao_dich: taoMaGiaoDich(),
        },
        { transaction: t },
      );

      // ================= XÓA GIỎ HÀNG =================
      await GioHangChiTiet.destroy({
        where: { gio_hang_id: gioHang.id },
        transaction: t,
      });

      const donHangDayDu = await DonHang.findByPk(donHang.id, {
        include: [
          {
            model: DonHangChiTiet,
            as: "chi_tiet",
            include: [{ model: Tranh, as: "tranh" }],
          },
          { model: DonViVanChuyen, as: "don_vi_van_chuyen" },
          {
            model: HoaDon,
            as: "hoa_don",
            include: [{ model: ThanhToan, as: "thanh_toan" }],
          },
        ],
        transaction: t,
      });

      return donHangDayDu;
    });

    return res.status(201).json({
      success: true,
      message: "Tạo đơn hàng thành công",
      data: ketQua,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message || "Tạo đơn hàng thất bại",
    });
  }
};

// ================= KHÁCH HÀNG: XEM ĐƠN CỦA TÔI =================
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
      {
        model: HoaDon,
        as: "hoa_don",
        include: [{ model: ThanhToan, as: "thanh_toan" }],
      },
    ],
    order: [["ngay_dat", "DESC"]],
  });

  res.json({
    success: true,
    message: "Lấy đơn hàng của tôi thành công",
    data: danhSach,
  });
};

// ================= KHÁCH HÀNG: CHI TIẾT ĐƠN CỦA TÔI =================
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
    message: "Lấy chi tiết đơn hàng thành công",
    data: donHang,
  });
};

// ================= KHÁCH HÀNG: HỦY ĐƠN CỦA TÔI =================
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

  await sequelize.transaction(async (t) => {
    await donHang.update({ trang_thai: "huy" }, { transaction: t });

    const hoaDon = await HoaDon.findOne({
      where: { don_hang_id: donHang.id },
      transaction: t,
    });

    if (hoaDon) {
      await hoaDon.update({ trang_thai: "da_huy" }, { transaction: t });
    }
  });

  res.json({
    success: true,
    message: "Hủy đơn hàng thành công",
    data: donHang,
  });
};

// ================= NHÂN VIÊN: XEM TẤT CẢ ĐƠN =================
const xemTatCaDonHang = async (req, res) => {
  const { trang_thai, search, page = 1, limit = 10 } = req.query;

  const whereCondition = {};

  if (trang_thai) {
    whereCondition.trang_thai = trang_thai;
  }

  if (search) {
    whereCondition[Op.or] = [
      { ma_don_hang: { [Op.like]: `%${search}%` } },
      { dia_chi_giao: { [Op.like]: `%${search}%` } },
    ];
  }

  const currentPage = Number(page) || 1;
  const currentLimit = Number(limit) || 10;

  const danhSach = await DonHang.findAndCountAll({
    where: whereCondition,
    include: [
      { model: KhachHang, as: "khach_hang" },
      { model: NhanVien, as: "nhan_vien" },
      { model: DonViVanChuyen, as: "don_vi_van_chuyen" },
      {
        model: HoaDon,
        as: "hoa_don",
        include: [{ model: ThanhToan, as: "thanh_toan" }],
      },
    ],
    order: [["ngay_dat", "DESC"]],
    offset: (currentPage - 1) * currentLimit,
    limit: currentLimit,
  });

  res.json({
    success: true,
    message: "Lấy tất cả đơn hàng thành công",
    data: danhSach.rows,
    total: danhSach.count,
    page: currentPage,
    limit: currentLimit,
  });
};

// ================= NHÂN VIÊN: CHI TIẾT ĐƠN BẤT KỲ =================
const xemChiTietDonBatKy = async (req, res) => {
  const { id } = req.params;

  const donHang = await DonHang.findByPk(id, {
    include: [
      {
        model: DonHangChiTiet,
        as: "chi_tiet",
        include: [{ model: Tranh, as: "tranh" }],
      },
      { model: KhachHang, as: "khach_hang" },
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
    message: "Lấy chi tiết đơn hàng thành công",
    data: donHang,
  });
};

// ================= NHÂN VIÊN: CẬP NHẬT TRẠNG THÁI ĐƠN =================
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
      error: "Trạng thái không hợp lệ",
    });
  }

  const donHang = await DonHang.findByPk(id);

  if (!donHang) {
    return res.status(404).json({
      success: false,
      error: "Không tìm thấy đơn hàng",
    });
  }

  await sequelize.transaction(async (t) => {
    await donHang.update(
      {
        trang_thai,
        nhan_vien_id: req.user.nhan_vien_id,
      },
      { transaction: t },
    );

    if (trang_thai === "huy") {
      const hoaDon = await HoaDon.findOne({
        where: { don_hang_id: donHang.id },
        transaction: t,
      });

      if (hoaDon) {
        await hoaDon.update({ trang_thai: "da_huy" }, { transaction: t });
      }
    }
  });

  res.json({
    success: true,
    message: "Cập nhật trạng thái đơn hàng thành công",
    data: donHang,
  });
};

// ================= NHÂN VIÊN: HỦY ĐƠN BẤT KỲ =================
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

  await sequelize.transaction(async (t) => {
    await donHang.update({ trang_thai: "huy" }, { transaction: t });

    const hoaDon = await HoaDon.findOne({
      where: { don_hang_id: donHang.id },
      transaction: t,
    });

    if (hoaDon) {
      await hoaDon.update({ trang_thai: "da_huy" }, { transaction: t });
    }
  });

  res.json({
    success: true,
    message: "Hủy đơn hàng thành công",
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
