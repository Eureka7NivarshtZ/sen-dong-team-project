const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { TaiKhoan, sequelize, KhachHang, NhanVien } = require("../models");

const taoToken = (taiKhoan) => {
  return jwt.sign(
    {
      id: taiKhoan.id,
      email: taiKhoan.email,
      loai: taiKhoan.loai,
      nhan_vien_id: taiKhoan.nhan_vien?.id || null,
      vai_tro: taiKhoan.nhan_vien?.vai_tro || null,
      khach_hang_id: taiKhoan.khach_hang?.id || null,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );
};

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

const dangNhap = async (req, res) => {
  const { email, mat_khau } = req.body;

  if (!email || !mat_khau) {
    return res.status(400).json({
      message: "Vui long nhap email va mat khau",
    });
  }

  const taiKhoan = await TaiKhoan.findOne({
    where: { email },
    include: [
      {
        model: KhachHang,
        as: "khach_hang",
      },
      {
        model: NhanVien,
        as: "nhan_vien",
      },
    ],
  });

  if (!taiKhoan) {
    return res.status(400).json({
      error: "Email hoac mat khau khong dung",
    });
  }

  if (!taiKhoan.kich_hoat) {
    return res.status(403).json({
      message: "Tai khoan da bi khoa",
    });
  }

  const dungMatKhau = await bcrypt.compare(mat_khau, taiKhoan.mat_khau_hash);

  if (!dungMatKhau) {
    return res.status(401).json({
      message: "Email hoac mat khau khong dung",
    });
  }

  const token = taoToken(taiKhoan);

  res.json({
    token,
    tai_khoan: { id: taiKhoan.id, email: taiKhoan.email, loai: taiKhoan.loai },
    khach_hang: taiKhoan.khach_hang,
    nhan_vien: taiKhoan.nhan_vien,
  });
};

const layThongTinCuaToi = async (req, res) => {
  const taiKhoan = await TaiKhoan.findByPk(req.tai_khoan.id, {
    attributes: { exclude: ["mat_khau_hash"] },
    include: [
      { model: KhachHang, as: "khach_hang" },
      { model: NhanVien, as: "nhan_vien" },
    ],
  });

  res.json(taiKhoan);
};

const taoNhanVien = async (req, res) => {
  const { email, mat_khau, ho_ten, ngay_sinh, dia_chi, sdt, vai_tro } =
    req.body;

  if (!email || !mat_khau || !ho_ten || !vai_tro) {
    return res.status(400).json({
      error: "Vui long nhap day du email, mat khau, ho ten va vai tro",
    });
  }

  const vaiTroHopLe = ["quan_ly", "nhan_vien", "thu_ngan"];

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

module.exports = { dangKyKhachHang, dangNhap, layThongTinCuaToi, taoNhanVien };
