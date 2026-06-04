const { Op } = require("sequelize");
const models = require("../models");

// Tự động nạp an toàn hệ thống model
const Tranh = models.Tranh;
const DonHang = models.DonHang;
const KhachHang = models.KhachHang;
const ThanhToan = models.ThanhToan;
const VatLieu = models.VatLieu || models.Vatlieu || models.vatlieu; 

// 1. Hàm tính toán số liệu tổng quan của các thẻ Card
const tongQuanDashboard = async (req, res) => {
  try {
    const tongTranh = Tranh ? await Tranh.count() : 0;
    const tongKhachHang = KhachHang ? await KhachHang.count() : 0;
    const tongDonHang = DonHang ? await DonHang.count() : 0;

    const donChoXacNhan = DonHang ? await DonHang.count({
      where: {
        trang_thai: "cho_xac_nhan",
      },
    }) : 0;

    const tongDoanhThu = ThanhToan ? await ThanhToan.sum("so_tien", {
      where: {
        trang_thai: "thanh_cong",
      },
    }) : 0;

    const vatLieuCanhBao = VatLieu ? await VatLieu.count({
      where: {
        so_luong_ton: {
          [Op.lte]: 10,
        },
      },
    }) : 0;

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
  } catch (error) {
    res.status(500).json({ success: false, error: "Lỗi SQL đếm số liệu: " + error.message });
  }
};

// 2. Hàm lấy danh sách đơn hàng mới đặt
const donHangGanDay = async (req, res) => {
  try {
    if (!DonHang) return res.json({ success: true, data: [] });

    const danhSach = await DonHang.findAll({
      limit: 10,
      order: [["ngay_dat", "DESC"]], // 🌟 ĐÃ SỬA: Trả về đúng tên cột ngay_dat gốc trong Database của ông
      include: KhachHang ? [{ model: KhachHang, as: "khach_hang" }] : [],
    });

    res.json({
      success: true,
      message: "Lấy đơn hàng gần đây thành công",
      data: danhSach,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Hàm tính toán doanh thu theo từng tháng để vẽ biểu đồ cột
const doanhThuTheoThang = async (req, res) => {
  try {
    const { nam = new Date().getFullYear() } = req.query;
    const ketQua = [];

    if (!ThanhToan) {
      for (let i = 1; i <= 12; i++) ketQua.push({ thang: i, doanh_thu: 0 });
      return res.json({ success: true, data: ketQua });
    }

    for (let thang = 1; thang <= 12; thang++) {
      const ngayBatDau = new Date(nam, thang - 1, 1);
      const ngayKetThuc = new Date(nam, thang, 0, 23, 59, 59);

      const doanhThu = await ThanhToan.sum("so_tien", {
        where: {
          trang_thai: "thanh_cong",
          thoi_gian: { // 🌟 ĐÃ SỬA: Trả về đúng tên cột thoi_gian gốc trong Database của ông
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
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  tongQuanDashboard,
  donHangGanDay,
  doanhThuTheoThang,
};