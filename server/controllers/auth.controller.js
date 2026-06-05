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

      khach_hang_id: taiKhoan.khach_hang?.id || null,
      nhan_vien_id: taiKhoan.nhan_vien?.id || null,

      vai_tro: taiKhoan.nhan_vien?.vai_tro || taiKhoan.loai || null,
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
  try {
    const taiKhoanId = req.user?.id;

    if (!taiKhoanId) {
      return res.status(401).json({
        success: false,
        error: "Bạn chưa đăng nhập",
      });
    }

    const taiKhoan = await TaiKhoan.findByPk(taiKhoanId, {
      attributes: [
        "id",
        "email",
        "loai",
        "kich_hoat",
        "tao_luc",
        "cap_nhat_luc",
      ],
      include: [
        { model: KhachHang, as: "khach_hang" },
        { model: NhanVien, as: "nhan_vien" },
      ],
    });

    if (!taiKhoan) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy tài khoản",
      });
    }

    const thongTin =
      taiKhoan.loai === "khach_hang" ? taiKhoan.khach_hang : taiKhoan.nhan_vien;

    return res.json({
      success: true,
      message: "Lấy thông tin thành công",
      data: {
        tai_khoan_id: taiKhoan.id,
        email: taiKhoan.email,
        loai: taiKhoan.loai,
        vai_tro: thongTin?.vai_tro || taiKhoan.loai,
        kich_hoat: taiKhoan.kich_hoat,

        id: thongTin?.id || null,
        ho_ten: thongTin?.ho_ten || "",
        sdt: thongTin?.sdt || "",
        dia_chi: thongTin?.dia_chi || "",

        created_at: thongTin?.tao_luc || taiKhoan.tao_luc,
        updated_at: thongTin?.cap_nhat_luc || taiKhoan.cap_nhat_luc,
      },
    });
  } catch (error) {
    console.error("Lỗi lấy thông tin cá nhân:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Lấy thông tin thất bại",
    });
  }
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

const capNhatThongTinCuaToi = async (req, res) => {
  try {
    const taiKhoanId = req.user?.id;
    const loai = req.user?.loai;

    const { ho_ten, sdt, dia_chi } = req.body;

    if (!taiKhoanId) {
      return res.status(401).json({
        success: false,
        error: "Bạn chưa đăng nhập",
      });
    }

    if (!ho_ten || !ho_ten.trim()) {
      return res.status(400).json({
        success: false,
        error: "Họ và tên không được để trống",
      });
    }

    const taiKhoan = await TaiKhoan.findByPk(taiKhoanId, {
      attributes: [
        "id",
        "email",
        "loai",
        "kich_hoat",
        "tao_luc",
        "cap_nhat_luc",
      ],
    });

    if (!taiKhoan) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy tài khoản",
      });
    }

    let model = null;

    if (taiKhoan.loai === "khach_hang" || loai === "khach_hang") {
      model = KhachHang;
    } else if (taiKhoan.loai === "nhan_vien" || loai === "nhan_vien") {
      model = NhanVien;
    } else {
      return res.status(403).json({
        success: false,
        error: "Loại tài khoản không hợp lệ",
      });
    }

    const thongTin = await model.findOne({
      where: { tai_khoan_id: taiKhoanId },
    });

    if (!thongTin) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy thông tin người dùng",
      });
    }

    const dataCapNhat = {
      ho_ten: ho_ten.trim(),
      sdt: sdt?.trim() || null,
    };

    // Chỉ update địa chỉ nếu model có field dia_chi.
    // Nếu bảng NhanVien không có dia_chi thì đoạn này tránh lỗi.
    if (Object.prototype.hasOwnProperty.call(thongTin.dataValues, "dia_chi")) {
      dataCapNhat.dia_chi = dia_chi?.trim() || null;
    }

    await thongTin.update(dataCapNhat);

    return res.json({
      success: true,
      message: "Cập nhật thông tin cá nhân thành công",
      data: {
        tai_khoan_id: taiKhoan.id,
        email: taiKhoan.email,
        loai: taiKhoan.loai,
        vai_tro: thongTin.vai_tro || taiKhoan.loai,
        kich_hoat: taiKhoan.kich_hoat,

        id: thongTin.id,
        ho_ten: thongTin.ho_ten,
        sdt: thongTin.sdt,
        dia_chi: thongTin.dia_chi || "",

        created_at: thongTin.tao_luc || taiKhoan.tao_luc,
        updated_at: thongTin.cap_nhat_luc || taiKhoan.cap_nhat_luc,
      },
    });
  } catch (error) {
    console.error("Lỗi cập nhật thông tin cá nhân:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Cập nhật thông tin cá nhân thất bại",
    });
  }
};

module.exports = {
  dangNhap,
  xemThongTinCuaToi,
  dangKyKhachHang,
  quenMatKhau,
  datLaiMatKhau,
  capNhatThongTinCuaToi,
};
