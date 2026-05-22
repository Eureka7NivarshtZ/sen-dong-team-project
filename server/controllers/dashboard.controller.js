const { Op } = require("sequelize");

const { Tranh, DonHang, KhachHang, ThanhToan, VatLieu } = require("../models");

const tongQuanDashboard = async (req, res) => {
  const tongTranh = await Tranh.count();
  const tongKhachHang = await KhachHang.count();
  const tongDonHang = await DonHang.count();

  const donChoXacNhan = await DonHang.count({
    where: {
      trang_thai: "cho_xac_nhan",
    },
  });

  const tongDoanhThu = await ThanhToan.sum("so_tien", {
    where: {
      trang_thai: "thanh_cong",
    },
  });

  const vatLieuCanhBao = await VatLieu.count({
    where: {
      so_luong_ton: {
        [Op.lte]: 10,
      },
    },
  });

  res.json({
    success: true,
    message: "Lấy tổng quan dashboard thành công",
    data: {
      tong_tranh: tongTranh,
      tong_khach_hang: tongKhachHang,
      tong_don_hang: tongDonHang,
      don_cho_xac_nhan: donChoXacNhan,
      tong_doanh_thu: Number(tongDoanhThu || 0),
      vat_lieu_canh_bao: vatLieuCanhBao,
    },
  });
};

const donHangGanDay = async (req, res) => {
  const danhSach = await DonHang.findAll({
    limit: 10,
    order: [["ngay_dat", "DESC"]],
    include: [{ model: KhachHang, as: "khach_hang" }],
  });

  res.json({
    success: true,
    message: "Lấy đơn hàng gần đây thành công",
    data: danhSach,
  });
};

const doanhThuTheoThang = async (req, res) => {
  const { nam = new Date().getFullYear() } = req.query;

  const ketQua = [];

  for (let thang = 1; thang <= 12; thang++) {
    const ngayBatDau = new Date(nam, thang - 1, 1);
    const ngayKetThuc = new Date(nam, thang, 0, 23, 59, 59);

    const doanhThu = await ThanhToan.sum("so_tien", {
      where: {
        trang_thai: "thanh_cong",
        thoi_gian: {
          [Op.between]: [ngayBatDau, ngayKetThuc],
        },
      },
    });

    ketQua.push({
      thang,
      doanh_thu: Number(doanhThu || 0),
    });
  }

  res.json({
    success: true,
    message: "Lấy doanh thu theo tháng thành công",
    data: ketQua,
  });
};

module.exports = {
  tongQuanDashboard,
  donHangGanDay,
  doanhThuTheoThang,
};
