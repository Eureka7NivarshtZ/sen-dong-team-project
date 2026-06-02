const { ThanhToan, HoaDon, DonHang } = require("../models");

const taoMaGiaoDich = () => `GD-${Date.now()}`;

const PHUONG_THUC_HOP_LE = ["tien_mat", "chuyen_khoan", "the"];
const TRANG_THAI_HOP_LE = [
  "cho_thanh_toan",
  "thanh_cong",
  "that_bai",
  "hoan_tien",
];

const taoThanhToan = async (req, res) => {
  const {
    hoa_don_id,
    so_tien,
    phuong_thuc,
    trang_thai = "cho_thanh_toan",
  } = req.body;

  if (!hoa_don_id || !so_tien || !phuong_thuc) {
    return res.status(400).json({
      success: false,
      error: "Vui lòng nhập hoa_don_id, so_tien và phuong_thuc",
    });
  }

  if (!PHUONG_THUC_HOP_LE.includes(phuong_thuc)) {
    return res.status(400).json({
      success: false,
      error: "Phương thức thanh toán không hợp lệ",
    });
  }

  if (!TRANG_THAI_HOP_LE.includes(trang_thai)) {
    return res.status(400).json({
      success: false,
      error: "Trạng thái thanh toán không hợp lệ",
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
      error: "Không tìm thấy hóa đơn",
    });
  }

  if (hoaDon.trang_thai === "da_huy") {
    return res.status(400).json({
      success: false,
      error: "Không thể thanh toán hóa đơn đã hủy",
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
      error: "Hóa đơn này đã được thanh toán đủ",
    });
  }

  if (Number(so_tien) <= 0) {
    return res.status(400).json({
      success: false,
      error: "Số tiền thanh toán phải lớn hơn 0",
    });
  }

  const thanhToan = await ThanhToan.create({
    hoa_don_id,
    so_tien,
    phuong_thuc,
    trang_thai,
    ma_giao_dich: taoMaGiaoDich(),
  });

  if (trang_thai === "thanh_cong" && hoaDon.don_hang) {
    await hoaDon.don_hang.update({
      trang_thai: "dang_chuan_bi",
    });
  }

  res.status(201).json({
    success: true,
    message: "Tạo thanh toán thành công",
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
    message: "Lấy danh sách thanh toán thành công",
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
      error: "Không tìm thấy thanh toán",
    });
  }

  res.json({
    success: true,
    message: "Lấy chi tiết thanh toán thành công",
    data: thanhToan,
  });
};

const capNhatTrangThaiThanhToan = async (req, res) => {
  const { id } = req.params;
  const { trang_thai } = req.body;

  if (!TRANG_THAI_HOP_LE.includes(trang_thai)) {
    return res.status(400).json({
      success: false,
      error: "Trạng thái thanh toán không hợp lệ",
    });
  }

  const thanhToan = await ThanhToan.findByPk(id, {
    include: [
      {
        model: HoaDon,
        as: "hoa_don",
        include: [
          {
            model: DonHang,
            as: "don_hang",
          },
        ],
      },
    ],
  });

  if (!thanhToan) {
    return res.status(404).json({
      success: false,
      error: "Không tìm thấy thanh toán",
    });
  }

  await thanhToan.update({
    trang_thai,
  });

  if (
    trang_thai === "thanh_cong" &&
    thanhToan.hoa_don &&
    thanhToan.hoa_don.don_hang
  ) {
    await thanhToan.hoa_don.don_hang.update({
      trang_thai: "dang_chuan_bi",
    });
  }

  res.json({
    success: true,
    message: "Cập nhật trạng thái thanh toán thành công",
    data: thanhToan,
  });
};

module.exports = {
  taoThanhToan,
  layTatCaThanhToan,
  layChiTietThanhToan,
  capNhatTrangThaiThanhToan,
};
