const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { TaiKhoan, sequelize, KhachHang } = require("../models");

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

module.exports = { dangKyKhachHang };
