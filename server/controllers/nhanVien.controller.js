const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { TaiKhoan, sequelize, NhanVien } = require("../models");

const chieuTuyenNhanVien = async (req, res) => {
  const {
    email,
    mat_khau,
    ho_ten,
    ngay_sinh,
    dia_chi,
    sdt,
    vai_tro,
  } = req.body;

  if (!email || !mat_khau || !ho_ten || !vai_tro) {
    return res.status(400).json({
      error: "Vui long nhap day du email, mat khau, ho ten va vai tro",
    });
  }

  const vaiTroHopLe = ["quan_ly", "ban_hang", "kho"];

  if (!vaiTroHopLe.includes(vai_tro)) {
    return res.status(400).json({
      error: "Vai tro khong hop le",
    });
  }

  const taiKhoanTonTai = await TaiKhoan.findOne({ where: { email } });

  if (taiKhoanTonTai) {
    return res.status(400).json({
      error: "Email da duoc su dung",
    });
  }

  const mat_khau_hash = await bcrypt.hash(mat_khau, 10);

  const ketQua = await sequelize.transaction(async (t) => {
    const taiKhoan = await TaiKhoan.create(
      {
        email,
        mat_khau_hash,
        loai: "nhan_vien",
      },
      { transaction: t },
    );

    const nhanVien = await NhanVien.create(
      {
        tai_khoan_id: taiKhoan.id,
        ho_ten,
        ngay_sinh,
        dia_chi,
        sdt,
        vai_tro,
        hoat_dong: true,
      },
      { transaction: t },
    );

    return { taiKhoan, nhanVien };
  });

  res.status(201).json({
    tai_khoan: {
      id: ketQua.taiKhoan.id,
      email: ketQua.taiKhoan.email,
      loai: ketQua.taiKhoan.loai,
    },
    nhan_vien: ketQua.nhanVien,
  });
};

// ==================== ADMIN ====================
const xemTatCaNhanVien = async (req, res) => {
  try {
    const { vai_tro, search, page = 1, limit = 10 } = req.query;

    let whereCondition = {};

    if (vai_tro) {
      whereCondition.vai_tro = vai_tro;
    }

    if (search) {
      whereCondition = {
        ...whereCondition,
        [require("sequelize").Op.or]: [
          { ho_ten: { [require("sequelize").Op.like]: `%${search}%` } },
          { sdt: { [require("sequelize").Op.like]: `%${search}%` } },
        ],
      };
    }

    const danhSach = await NhanVien.findAndCountAll({
      where: whereCondition,
      include: [{ model: TaiKhoan, as: "tai_khoan" }],
      order: [["ho_ten", "ASC"]],
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

const xemChiTietNhanVien = async (req, res) => {
  try {
    const { id } = req.params;

    const nhanVien = await NhanVien.findByPk(id, {
      include: [{ model: TaiKhoan, as: "tai_khoan" }],
    });

    if (!nhanVien) {
      return res.status(404).json({
        error: "Không tìm thấy nhân viên",
      });
    }

    res.json(nhanVien);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const khoaNhanVien = async (req, res) => {
  try {
    const { id } = req.params;

    const nhanVien = await NhanVien.findByPk(id, {
      include: [{ model: TaiKhoan, as: "tai_khoan" }],
    });

    if (!nhanVien) {
      return res.status(404).json({
        error: "Không tìm thấy nhân viên",
      });
    }

    // Khóa tài khoản và vô hiệu hóa nhân viên
    await nhanVien.tai_khoan.update({ kich_hoat: false });
    await nhanVien.update({ hoat_dong: false });

    res.json({
      message: "Đã khóa nhân viên",
      nhan_vien: nhanVien,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  chieuTuyenNhanVien,
  xemTatCaNhanVien,
  xemChiTietNhanVien,
  khoaNhanVien,
  taoNhanVien: chieuTuyenNhanVien, // Alias
};
