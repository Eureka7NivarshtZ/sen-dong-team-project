const bcrypt = require("bcrypt");
const { TaiKhoan, sequelize, KhachHang, DonHang } = require("../models");

// ==================== ADMIN ====================
const xemTatCaKhachHang = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    let whereCondition = {};

    if (search) {
      whereCondition = {
        [require("sequelize").Op.or]: [
          { ho_ten: { [require("sequelize").Op.like]: `%${search}%` } },
          { sdt: { [require("sequelize").Op.like]: `%${search}%` } },
        ],
      };
    }

    const danhSach = await KhachHang.findAndCountAll({
      where: whereCondition,
      include: [
        { model: TaiKhoan, as: "tai_khoan" },
        {
          model: DonHang,
          as: "khach_hang",
          required: false,
        },
      ],
      order: [["tao_luc", "DESC"]],
      offset: (page - 1) * limit,
      limit: parseInt(limit),
    });

    res.json({
      success: true,
      message: "Lay danh sach khach hang thanh cong",
      data: danhSach.rows,
      total: danhSach.count,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
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
        { model: TaiKhoan, as: "tai_khoan" },
        {
          model: DonHang,
          as: "khach_hang",
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
      include: [{ model: TaiKhoan, as: "tai_khoan" }],
    });

    if (!khachHang) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy khách hàng",
      });
    }

    await khachHang.tai_khoan.update({ kich_hoat: false });

    res.json({
      success: true,
      message: "Khoa tai khoan khach hang thanh cong",
      data: khachHang,
    });
  } catch (error) {
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
