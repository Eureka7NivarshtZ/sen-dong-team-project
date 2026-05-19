const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { TaiKhoan, sequelize, NhanVien } = require("../models");

const taoNhanVien = async (req, res) => {
  const { email, mat_khau, ho_ten, ngay_sinh, dia_chi, sdt, vai_tro } =
    req.body;

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

module.exports = { taoNhanVien };
