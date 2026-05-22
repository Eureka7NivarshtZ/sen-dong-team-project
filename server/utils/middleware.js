const jwt = require("jsonwebtoken");
const { TaiKhoan } = require("../models");

const xuLyLoi = async (err, req, res, next) => {
  console.log(err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Loi server",
  });
};

const yeuCauDangNhap = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Thieu token",
    });
  }

  const token = authHeader.split(" ")[1];

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken.id) {
    return res.status(401).json({
      success: false,
      error: "Token khong hop le",
    });
  }

  const taiKhoan = await TaiKhoan.findByPk(decodedToken.id);

  if (!taiKhoan.kich_hoat) {
    return res.status(403).json({
      success: false,
      error: "Tai khoan da bi khoa",
    });
  }

  req.user = decodedToken;

  next();
};

const yeuCauKhachHang = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Ban chua dang nhap",
    });
  }

  if (req.user.loai !== "khach_hang") {
    return res.status(403).json({
      error: "Chi khach hang moi duoc thuc hien thao tac nay",
    });
  }

  next();
};

const yeuCauNhanVien = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Ban chua dang nhap",
    });
  }

  if (req.user.loai !== "nhan_vien") {
    return res.status(403).json({
      error: "Chi nhan vien moi duoc thuc hien thao tac nay",
    });
  }

  next();
};

const kiemTraVaiTro = (vaiTroYeuCau) => {
  const danhSachVaiTro = Array.isArray(vaiTroYeuCau)
    ? vaiTroYeuCau
    : [vaiTroYeuCau];

  return (req, res, next) => {
    if (!req.user || req.user.loai !== "nhan_vien") {
      return res.status(403).json({
        error: "Chi nhan vien moi duoc thuc hien thao tac nay",
      });
    }

    if (!danhSachVaiTro.includes(req.user.vai_tro)) {
      return res.status(403).json({
        error: `Chi cac vai tro sau moi duoc thuc hien: ${danhSachVaiTro.join(", ")}`,
      });
    }

    next();
  };
};

module.exports = {
  xuLyLoi,
  yeuCauDangNhap,
  yeuCauKhachHang,
  yeuCauNhanVien,
  kiemTraVaiTro,
};
