const { Op } = require("sequelize");
const { TaiKhoan, KhachHang, DonHang } = require("../models");

// ==================== ADMIN ====================
const xemTatCaKhachHang = async (req, res) => {
  try {
    const { search } = req.query;

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);

    const whereCondition = {};

    if (search) {
      whereCondition[Op.or] = [
        { ho_ten: { [Op.like]: `%${search}%` } },
        { sdt: { [Op.like]: `%${search}%` } },
      ];
    }

    const danhSach = await KhachHang.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: TaiKhoan,
          as: "tai_khoan",
        },
        {
          model: DonHang,
          as: "don_hang", // đổi theo alias thật trong model của bạn
          required: false,
        },
      ],
      distinct: true,
      order: [["tao_luc", "DESC"]],
      offset: (page - 1) * limit,
      limit,
    });

    res.json({
      success: true,
      message: "Lay danh sach khach hang thanh cong",
      data: danhSach.rows,
      total: danhSach.count,
      page,
      limit,
    });
  } catch (error) {
    console.error("Lỗi xemTatCaKhachHang:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const xemChiTietKhachHang = async (req, res) => {
  try {
    const { id } = req.params;

    const khachHang = await KhachHang.findByPk(id, {
      include: [
        {
          model: TaiKhoan,
          as: "tai_khoan",
        },
        {
          model: DonHang,
          as: "don_hang", // đổi theo alias thật
          required: false,
        },
      ],
    });

    if (!khachHang) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy khách hàng",
      });
    }

    res.json({
      success: true,
      message: "Lay chi tiet khach hang thanh cong",
      data: khachHang,
    });
  } catch (error) {
    console.error("Lỗi xemChiTietKhachHang:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const khoa_KhachHang = async (req, res) => {
  try {
    const { id } = req.params;

    const khachHang = await KhachHang.findByPk(id, {
      include: [
        {
          model: TaiKhoan,
          as: "tai_khoan",
        },
      ],
    });

    if (!khachHang) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy khách hàng",
      });
    }

    if (!khachHang.tai_khoan) {
      return res.status(404).json({
        success: false,
        error: "Khách hàng chưa có tài khoản liên kết",
      });
    }

    await khachHang.tai_khoan.update({ kich_hoat: false });

    res.json({
      success: true,
      message: "Khoa tai khoan khach hang thanh cong",
      data: khachHang,
    });
  } catch (error) {
    console.error("Lỗi khoa_KhachHang:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  xemTatCaKhachHang,
  xemChiTietKhachHang,
  khoa_KhachHang,
};
