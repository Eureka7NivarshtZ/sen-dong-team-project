const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { TaiKhoan, KhachHang, NhanVien, sequelize } = require("../models");

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
  try {
    const { email, mat_khau } = req.body;

    if (!email || !mat_khau) {
      return res.status(400).json({
        success: false,
        error: "Vui long nhap email va mat khau",
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
        success: false,
        error: "Email hoac mat khau khong dung",
      });
    }

    if (!taiKhoan.kich_hoat) {
      return res.status(403).json({
        success: false,
        error: "Tai khoan da bi khoa",
      });
    }

    const dungMatKhau = await bcrypt.compare(mat_khau, taiKhoan.mat_khau_hash);

    if (!dungMatKhau) {
      return res.status(401).json({
        success: false,
        error: "Email hoac mat khau khong dung",
      });
    }

    const token = taoToken(taiKhoan);

    res.json({
      success: true,
      message: "Dang nhap thanh cong",
      data: {
        token,
        tai_khoan: {
          id: taiKhoan.id,
          email: taiKhoan.email,
          loai: taiKhoan.loai,
        },
        khach_hang: taiKhoan.khach_hang,
        nhan_vien: taiKhoan.nhan_vien,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Đăng nhập không thành công",
    });
  }
};

const xemThongTinCuaToi = async (req, res) => {
  const taiKhoan = await TaiKhoan.findByPk(req.user.id, {
    attributes: { exclude: ["mat_khau_hash"] },
    include: [
      { model: KhachHang, as: "khach_hang" },
      { model: NhanVien, as: "nhan_vien" },
    ],
  });

  res.json({
    success: true,
    message: "Lay thong tin thanh cong",
    data: taiKhoan,
  });
};

const dangKyKhachHang = async (req, res) => {
  const { email, mat_khau, ho_ten, sdt, dia_chi } = req.body;

  if (!email || !mat_khau || !ho_ten) {
    return res.status(400).json({
      success: false,
      error: "Vui long nhap day du email, mat khau va ho ten",
    });
  }

  const taiKhoan = await TaiKhoan.findOne({ where: { email } });

  if (taiKhoan) {
    return res.status(400).json({
      success: false,
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
    success: true,
    message: "Dang ky khach hang thanh cong",
    data: {
      tai_khoan: {
        id: ketQua.taiKhoan.id,
        email: ketQua.taiKhoan.email,
        loai: ketQua.taiKhoan.loai,
      },
      khach_hang: ketQua.khachHang,
    },
  });
};

const quenMatKhau = async (req, res) => {
  const { email } = req.body || {};

  if (!email) {
    return res.status(400).json({
      success: false,
      error: "Vui long nhap email",
    });
  }

  const taiKhoan = await TaiKhoan.findOne({
    where: { email },
  });

  // Không tiết lộ email có tồn tại hay không
  if (!taiKhoan) {
    return res.json({
      success: true,
      message: "Neu email ton tai, lien ket dat lai mat khau da duoc tao",
    });
  }

  const tokenRaw = crypto.randomBytes(32).toString("hex");

  const tokenHash = crypto.createHash("sha256").update(tokenRaw).digest("hex");

  taiKhoan.token_dat_lai_mat_khau = tokenHash;
  taiKhoan.token_dat_lai_mat_khau_het_han = new Date(
    Date.now() + 15 * 60 * 1000,
  );

  await taiKhoan.save();

  // Thực tế nên gửi tokenRaw qua email
  // Ví dụ link:
  // http://localhost:3000/dat-lai-mat-khau?token=tokenRaw

  res.json({
    success: true,
    message: "Tao token dat lai mat khau thanh cong",
    data: {
      reset_token: tokenRaw,
      het_han_sau_phut: 15,
    },
  });
};

const datLaiMatKhau = async (req, res) => {
  const { token, mat_khau_moi } = req.body;

  if (!token || !mat_khau_moi) {
    return res.status(400).json({
      success: false,
      error: "Vui long nhap token va mat khau moi",
    });
  }

  if (mat_khau_moi.length < 6) {
    return res.status(400).json({
      success: false,
      error: "Mat khau moi phai co it nhat 6 ky tu",
    });
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const taiKhoan = await TaiKhoan.findOne({
    where: {
      token_dat_lai_mat_khau: tokenHash,
    },
  });

  if (!taiKhoan) {
    return res.status(400).json({
      success: false,
      error: "Token khong hop le",
    });
  }

  if (
    !taiKhoan.token_dat_lai_mat_khau_het_han ||
    taiKhoan.token_dat_lai_mat_khau_het_han < new Date()
  ) {
    return res.status(400).json({
      success: false,
      error: "Token da het han",
    });
  }

  const mat_khau_hash = await bcrypt.hash(mat_khau_moi, 10);

  taiKhoan.mat_khau_hash = mat_khau_hash;
  taiKhoan.token_dat_lai_mat_khau = null;
  taiKhoan.token_dat_lai_mat_khau_het_han = null;

  await taiKhoan.save();

  res.json({
    success: true,
    message: "Dat lai mat khau thanh cong",
  });
};

module.exports = {
  dangNhap,
  xemThongTinCuaToi,
  dangKyKhachHang,
  quenMatKhau,
  datLaiMatKhau,
};
