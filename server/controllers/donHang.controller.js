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
} = require("../models");
const { Op } = require("sequelize");

// ==================== KHÁCH HÀNG ====================
const taoDonHang = async (req, res) => {
  try {
    const { dia_chi_giao, ghi_chu, don_hang_chi_tiet } = req.body;
    const khachHangId = req.user.khach_hang_id;

    if (
      !dia_chi_giao ||
      !Array.isArray(don_hang_chi_tiet) ||
      don_hang_chi_tiet.length === 0
    ) {
      return res.status(400).json({
        error: "Vui lòng cung cấp địa chỉ giao và chi tiết sản phẩm",
      });
    }

    const ketQua = await sequelize.transaction(async (t) => {
      // Tính tổng tiền
      let tongTienHang = 0;
      for (const item of don_hang_chi_tiet) {
        const tranh = await Tranh.findByPk(item.tranh_id, { transaction: t });
        if (!tranh) {
          throw new Error(`Sản phẩm ${item.tranh_id} không tồn tại`);
        }

        if (tranh.so_luong_ton < item.so_luong) {
          throw new Error(`Sản phẩm ${tranh.ten_tranh} không đủ số lượng`);
        }

        tongTienHang += tranh.gia_ban * item.so_luong;

        // Cập nhật số lượng tồn
        await tranh.update(
          {
            so_luong_ton: tranh.so_luong_ton - item.so_luong,
          },
          { transaction: t },
        );
      }

      // Tạo đơn hàng
      const maDonHang = `DH-${Date.now()}`;
      const donHang = await DonHang.create(
        {
          khach_hang_id: khachHangId,
          ma_don_hang: maDonHang,
          dia_chi_giao,
          tong_tien_hang: tongTienHang,
          phi_van_chuyen: 0,
          giam_gia: 0,
          ghi_chu,
          trang_thai: "cho_xac_nhan",
        },
        { transaction: t },
      );

      // Tạo chi tiết đơn hàng
      for (const item of don_hang_chi_tiet) {
        const tranh = await Tranh.findByPk(item.tranh_id, { transaction: t });
        await DonHangChiTiet.create(
          {
            don_hang_id: donHang.id,
            tranh_id: item.tranh_id,
            so_luong: item.so_luong,
            don_gia: tranh.gia_ban,
            co_lap_khung: item.co_lap_khung || false,
          },
          { transaction: t },
        );
      }

      // Tạo hóa đơn
      const soHoaDon = `HD-${Date.now()}`;
      const hoaDon = await HoaDon.create(
        {
          don_hang_id: donHang.id,
          so_hoa_don: soHoaDon,
          tong_tien_truoc_thue: tongTienHang,
          thue_suat: 10,
          loai: "ban_hang",
          trang_thai: "da_xuat",
        },
        { transaction: t },
      );

      return { donHang, hoaDon };
    });

    res.status(201).json(ketQua);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const xemDonCuaToi = async (req, res) => {
  try {
    const khachHangId = req.user.khach_hang_id;

    const danhSach = await DonHang.findAll({
      where: { khach_hang_id: khachHangId },
      include: [
        {
          model: DonHangChiTiet,
          as: "don_hang_chi_tiet",
          include: [{ model: Tranh, as: "tranh" }],
        },
        { model: NhanVien, as: "nhan_vien" },
        { model: DonViVanChuyen, as: "don_vi_van_chuyen" },
      ],
      order: [["ngay_dat", "DESC"]],
    });

    res.json(danhSach);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const xemChiTietDonCuaToi = async (req, res) => {
  try {
    const { id } = req.params;
    const khachHangId = req.user.khach_hang_id;

    const donHang = await DonHang.findOne({
      where: { id, khach_hang_id: khachHangId },
      include: [
        {
          model: DonHangChiTiet,
          as: "don_hang_chi_tiet",
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
        error: "Không tìm thấy đơn hàng",
      });
    }

    res.json(donHang);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const huyDonCuaToi = async (req, res) => {
  try {
    const { id } = req.params;
    const khachHangId = req.user.khach_hang_id;

    const donHang = await DonHang.findOne({
      where: { id, khach_hang_id: khachHangId },
    });

    if (!donHang) {
      return res.status(404).json({
        error: "Không tìm thấy đơn hàng",
      });
    }

    if (!["cho_xac_nhan", "dang_chuan_bi"].includes(donHang.trang_thai)) {
      return res.status(400).json({
        error: "Không thể hủy đơn hàng ở trạng thái này",
      });
    }

    await donHang.update({ trang_thai: "huy" });

    res.json(donHang);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== QUẢN LÝ (Admin) ====================
const xemTatCaDonHang = async (req, res) => {
  try {
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
      data: danhSach.rows,
      total: danhSach.count,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const xemChiTietDonBatKy = async (req, res) => {
  try {
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
        error: "Không tìm thấy đơn hàng",
      });
    }

    res.json(donHang);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const capNhatTrangThaiDon = async (req, res) => {
  try {
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
        error: "Trạng thái không hợp lệ",
      });
    }

    const donHang = await DonHang.findByPk(id);

    if (!donHang) {
      return res.status(404).json({
        error: "Không tìm thấy đơn hàng",
      });
    }

    await donHang.update({
      trang_thai,
      nhan_vien_id: req.user.nhan_vien_id,
    });

    res.json(donHang);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const huyDonBatKy = async (req, res) => {
  try {
    const { id } = req.params;

    const donHang = await DonHang.findByPk(id);

    if (!donHang) {
      return res.status(404).json({
        error: "Không tìm thấy đơn hàng",
      });
    }

    if (!["cho_xac_nhan", "dang_chuan_bi"].includes(donHang.trang_thai)) {
      return res.status(400).json({
        error: "Không thể hủy đơn hàng ở trạng thái này",
      });
    }

    await donHang.update({ trang_thai: "huy" });

    res.json(donHang);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
