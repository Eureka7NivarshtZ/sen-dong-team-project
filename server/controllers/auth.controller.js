const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { TaiKhoan, KhachHang, NhanVien } = require("../models");

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

const xemThongTinCuaToi = async (req, res) => {
  const taiKhoan = await TaiKhoan.findByPk(req.user.id, {
    attributes: { exclude: ["mat_khau_hash"] },
    include: [
      { model: KhachHang, as: "khach_hang" },
      { model: NhanVien, as: "nhan_vien" },
    ],
  });

  res.json(taiKhoan);
};

module.exports = { dangNhap, xemThongTinCuaToi };
