const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { TaiKhoan, sequelize, KhachHang, DonHang } = require("../models");

const dangKyKhachHang = async (req, res) => {
  const { email, mat_khau, ho_ten, sdt, dia_chi } = req.body;

  if (!email || !mat_khau || !ho_ten) {
    return res.status(400).json({
      error: "Vui long nhap day du email, mat khau va ho ten",
    });
  }

  const taiKhoan = await TaiKhoan.findOne({ where: { email } });

  if (taiKhoan) {
    return res.status(400).json({
      error: "email da duoc su dung",
    });
  }

  const mat_khau_hash = await bcrypt.hash(mat_khau, 10);

  const ketQua = await sequelize.transaction(async (t) => {
    const taiKhoan = await TaiKhoan.create(
      {
        email,
        mat_khau_hash,
        loai: "khach_hang",
      },
      { transaction: t },
    );

    const khachHang = await KhachHang.create(
      {
        tai_khoan_id: taiKhoan.id,
        ho_ten,
        sdt,
        dia_chi,
      },
      { transaction: t },
    );

    return { taiKhoan, khachHang };
  });

  res.status(201).json({
    tai_khoan: {
      id: ketQua.taiKhoan.id,
      email: ketQua.taiKhoan.email,
      loai: ketQua.taiKhoan.loai,
    },
    khach_hang: ketQua.khachHang,
  });
};

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
      data: danhSach.rows,
      total: danhSach.count,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
        error: "Không tìm thấy khách hàng",
      });
    }

    res.json(khachHang);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
        error: "Không tìm thấy khách hàng",
      });
    }

    await khachHang.tai_khoan.update({ kich_hoat: false });

    res.json({
      message: "Đã khóa tài khoản khách hàng",
      khach_hang: khachHang,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  dangKyKhachHang,
  xemTatCaKhachHang,
  xemChiTietKhachHang,
  khoa_KhachHang,
};
