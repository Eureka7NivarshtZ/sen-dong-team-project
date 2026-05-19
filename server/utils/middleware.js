const jwt = require("jsonwebtoken");
const { TaiKhoan } = require("../models");

const xuLyLoi = async (err, req, res, next) => {
  console.log(err);

  res.status(err.statusCode || 500).json({
    error: err.message || "Loi server",
  });

  next(err);
};

const layToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    req.token = authHeader.split(" ")[1];
  }

  next();
};

const layNguoiDungTuToken = async (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ error: "Thieu token" });
  }

  try {
    const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET);

    if (!decodedToken.id) {
      return res.status(401).json({
        error: "Token khong hop le",
      });
    }

    req.user = decodedToken;
    req.tai_khoan = await TaiKhoan.findByPk(decodedToken.id);

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Token khong hop le hoac da het han",
    });
  }
};

const yeuCauNhanVien = (req, res, next) => {
  if (!req.user || req.user.loai !== "nhan_vien") {
    return res.status(403).json({
      error: "Chi nhan vien moi duoc thuc hien thao tac nay",
    });
  }
  next();
};

const yeuCauQuanLy = (req, res, next) => {
  if (!req.user || req.user.loai !== "nhan_vien" || req.user.vai_tro !== "quan_ly") {
    return res.status(403).json({
      error: "Chi quan ly moi duoc thuc hien thao tac nay",
    });
  }
  next();
};

const kiemTraVaiTro = (vaiTroYeuCau) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Thieu token",
      });
    }

    if (req.user.loai !== "nhan_vien") {
      return res.status(403).json({
        error: "Chi nhan vien moi duoc thuc hien thao tac nay",
      });
    }

    if (!vaiTroYeuCau.includes(req.user.vai_tro)) {
      return res.status(403).json({
        error: `Chi cac vai tro sau moi duoc thuc hien: ${vaiTroYeuCau.join(", ")}`,
      });
    }

    next();
  };
};

module.exports = {
  xuLyLoi,
  layNguoiDungTuToken,
  layToken,
  yeuCauNhanVien,
  yeuCauQuanLy,
  kiemTraVaiTro,
};
