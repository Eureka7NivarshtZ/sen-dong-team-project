const { ThanhToan, HoaDon, DonHang } = require("../models");

const taoMaGiaoDich = () => {
  return `GD-${Date.now()}`;
};

const taoThanhToan = async (req, res) => {
  const { hoa_don_id, so_tien, phuong_thuc } = req.body;

  if (!hoa_don_id || !so_tien || !phuong_thuc) {
    return res.status(400).json({
      success: false,
      error: "Vui long nhap hoa_don_id, so_tien va phuong_thuc",
    });
  }

  if (!["tien_mat", "chuyen_khoan", "the"].includes(phuong_thuc)) {
    return res.status(400).json({
      success: false,
      error: "Phuong thuc thanh toan khong hop le",
    });
  }

  const hoaDon = await HoaDon.findByPk(hoa_don_id, {
    include: [
      {
        model: DonHang,
        as: "don_hang",
      },
    ],
  });

  if (!hoaDon) {
    return res.status(404).json({
      success: false,
      error: "Khong tim thay hoa don",
    });
  }

  if (hoaDon.trang_thai === "da_huy") {
    return res.status(400).json({
      success: false,
      error: "Khong the thanh toan hoa don da huy",
    });
  }

  const tongDaThanhToan = await ThanhToan.sum("so_tien", {
    where: {
      hoa_don_id,
      trang_thai: "thanh_cong",
    },
  });

  const daThanhToan = Number(tongDaThanhToan || 0);
  const soTienCanThanhToan = Number(hoaDon.tong_tien_sau_thue || 0);

  if (daThanhToan >= soTienCanThanhToan) {
    return res.status(400).json({
      success: false,
      error: "Hoa don nay da duoc thanh toan du",
    });
  }

  const thanhToan = await ThanhToan.create({
    hoa_don_id,
    so_tien,
    phuong_thuc,
    trang_thai: "thanh_cong",
    ma_giao_dich: taoMaGiaoDich(),
  });

  if (hoaDon.don_hang) {
    await hoaDon.don_hang.update({
      trang_thai: "dang_chuan_bi",
    });
  }

  res.status(201).json({
    success: true,
    message: "Tao thanh toan thanh cong",
    data: thanhToan,
  });
};

const layTatCaThanhToan = async (req, res) => {
  const danhSachThanhToan = await ThanhToan.findAll({
    include: [
      {
        model: HoaDon,
        as: "hoa_don",
      },
    ],
    order: [["thoi_gian", "DESC"]],
  });

  res.json({
    success: true,
    message: "Lay danh sach thanh toan thanh cong",
    data: danhSachThanhToan,
  });
};

const layChiTietThanhToan = async (req, res) => {
  const { id } = req.params;

  const thanhToan = await ThanhToan.findByPk(id, {
    include: [
      {
        model: HoaDon,
        as: "hoa_don",
      },
    ],
  });

  if (!thanhToan) {
    return res.status(404).json({
      success: false,
      error: "Khong tim thay thanh toan",
    });
  }

  res.json({
    success: true,
    message: "Lay chi tiet thanh toan thanh cong",
    data: thanhToan,
  });
};

const capNhatTrangThaiThanhToan = async (req, res) => {
  const { id } = req.params;
  const { trang_thai } = req.body;

  if (!["thanh_cong", "that_bai", "hoan_tien"].includes(trang_thai)) {
    return res.status(400).json({
      success: false,
      error: "Trang thai thanh toan khong hop le",
    });
  }

  const thanhToan = await ThanhToan.findByPk(id);

  if (!thanhToan) {
    return res.status(404).json({
      success: false,
      error: "Khong tim thay thanh toan",
    });
  }

  await thanhToan.update({
    trang_thai,
  });

  res.json({
    success: true,
    message: "Cap nhat trang thai thanh toan thanh cong",
    data: thanhToan,
  });
};

module.exports = {
  taoThanhToan,
  layTatCaThanhToan,
  layChiTietThanhToan,
  capNhatTrangThaiThanhToan,
};
