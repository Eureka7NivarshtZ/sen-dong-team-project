const { HoaDon, DonHang, ThanhToan } = require("../models");

const taoSoHoaDon = () => {
  return `HD-${Date.now()}`;
};

const taoHoaDon = async (req, res) => {
  const { don_hang_id } = req.body;

  if (!don_hang_id) {
    return res.status(400).json({
      error: "Vui long truyen don_hang_id",
    });
  }

  const donHang = await DonHang.findByPk(don_hang_id);

  if (!donHang) {
    return res.status(404).json({
      error: "Khong tim thay don hang",
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
      error: "Don hang nay da co hoa don",
    });
  }

  const hoaDon = await HoaDon.create({
    don_hang_id,
    so_hoa_don: taoSoHoaDon(),
    tong_tien_truoc_thue: donHang.thanh_tien,
    thue_suat: 10,
    loai: "ban_hang",
    trang_thai: "da_xuat",
  });

  res.status(201).json(hoaDon);
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

  res.json(danhSachHoaDon);
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
      error: "Khong tim thay hoa don",
    });
  }

  res.json(hoaDon);
};

const huyHoaDon = async (req, res) => {
  const { id } = req.params;

  const hoaDon = await HoaDon.findByPk(id);

  if (!hoaDon) {
    return res.status(404).json({
      error: "Khong tim thay hoa don",
    });
  }

  await hoaDon.update({
    trang_thai: "da_huy",
  });

  res.json(hoaDon);
};

module.exports = {
  taoHoaDon,
  layTatCaHoaDon,
  layChiTietHoaDon,
  huyHoaDon,
};
