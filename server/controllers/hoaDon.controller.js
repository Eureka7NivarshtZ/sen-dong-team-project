const { HoaDon, DonHang, ThanhToan } = require("../models");

const taoSoHoaDon = () => `HD-${Date.now()}`;

const tinhTongHoaDonTuDonHang = (donHang) => {
  return (
    Number(donHang.tong_tien_hang || 0) +
    Number(donHang.phi_van_chuyen || 0) -
    Number(donHang.giam_gia || 0)
  );
};

// API này giữ lại để admin tạo hóa đơn thủ công nếu cần.
// Luồng đặt hàng chính đã tạo hóa đơn trong donHang.controller.js.
const taoHoaDon = async (req, res) => {
  const { don_hang_id } = req.body;

  if (!don_hang_id) {
    return res.status(400).json({
      success: false,
      error: "Vui lòng truyền don_hang_id",
    });
  }

  const donHang = await DonHang.findByPk(don_hang_id);

  if (!donHang) {
    return res.status(404).json({
      success: false,
      error: "Không tìm thấy đơn hàng",
    });
  }

  const hoaDonTonTai = await HoaDon.findOne({
    where: {
      don_hang_id,
      loai: "ban_hang",
    },
  });

  if (hoaDonTonTai) {
    return res.status(400).json({
      success: false,
      error: "Đơn hàng này đã có hóa đơn",
    });
  }

  const thueSuat = 10;
  const tongSauThue = tinhTongHoaDonTuDonHang(donHang);
  const tongTruocThue = Math.round(tongSauThue / (1 + thueSuat / 100));

  const hoaDon = await HoaDon.create({
    don_hang_id,
    so_hoa_don: taoSoHoaDon(),
    tong_tien_truoc_thue: tongTruocThue,
    thue_suat: thueSuat,
    loai: "ban_hang",
    trang_thai: "da_xuat",
  });

  res.status(201).json({
    success: true,
    message: "Tạo hóa đơn thành công",
    data: hoaDon,
  });
};

const layTatCaHoaDon = async (req, res) => {
  const danhSachHoaDon = await HoaDon.findAll({
    include: [
      {
        model: DonHang,
        as: "don_hang",
      },
      {
        model: ThanhToan,
        as: "thanh_toan",
      },
    ],
    order: [["ngay_xuat", "DESC"]],
  });

  res.json({
    success: true,
    message: "Lấy danh sách hóa đơn thành công",
    data: danhSachHoaDon,
  });
};

const layChiTietHoaDon = async (req, res) => {
  const { id } = req.params;

  const hoaDon = await HoaDon.findByPk(id, {
    include: [
      {
        model: DonHang,
        as: "don_hang",
      },
      {
        model: ThanhToan,
        as: "thanh_toan",
      },
    ],
  });

  if (!hoaDon) {
    return res.status(404).json({
      success: false,
      error: "Không tìm thấy hóa đơn",
    });
  }

  res.json({
    success: true,
    message: "Lấy chi tiết hóa đơn thành công",
    data: hoaDon,
  });
};

const huyHoaDon = async (req, res) => {
  const { id } = req.params;

  const hoaDon = await HoaDon.findByPk(id);

  if (!hoaDon) {
    return res.status(404).json({
      success: false,
      error: "Không tìm thấy hóa đơn",
    });
  }

  await hoaDon.update({
    trang_thai: "da_huy",
  });

  res.json({
    success: true,
    message: "Hủy hóa đơn thành công",
    data: hoaDon,
  });
};

module.exports = {
  taoHoaDon,
  layTatCaHoaDon,
  layChiTietHoaDon,
  huyHoaDon,
};
