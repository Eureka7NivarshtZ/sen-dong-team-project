const bcrypt = require("bcrypt");

const { sequelize, TaiKhoan, NhanVien } = require("../models");

const layTatCaNhanVien = async (req, res) => {
  const danhSachNhanVien = await NhanVien.findAll({
    include: [
      {
        model: TaiKhoan,
        as: "tai_khoan",
        attributes: ["id", "email", "loai", "kich_hoat", "tao_luc"],
      },
    ],
    order: [["ho_ten", "ASC"]],
  });

  res.json(danhSachNhanVien);
};

const layChiTietNhanVien = async (req, res) => {
  const { id } = req.params;

  const nhanVien = await NhanVien.findByPk(id, {
    include: [
      {
        model: TaiKhoan,
        as: "tai_khoan",
        attributes: ["id", "email", "loai", "kich_hoat", "tao_luc"],
      },
    ],
  });

  if (!nhanVien) {
    return res.status(404).json({
      error: "Không tìm thấy nhân viên",
    });
  }

  res.json(nhanVien);
};

const themNhanVien = async (req, res) => {
  const transaction = await sequelize.transaction();

  const { email, mat_khau, ho_ten, ngay_sinh, dia_chi, sdt, vai_tro } =
    req.body;

  if (!email || !mat_khau || !ho_ten || !vai_tro) {
    await transaction.rollback();

    return res.status(400).json({
      error: "Vui lòng nhập email, mật khẩu, họ tên và vai trò",
    });
  }

  const vaiTroHopLe = ["quan_ly", "ban_hang", "kho"];

  if (!vaiTroHopLe.includes(vai_tro)) {
    await transaction.rollback();

    return res.status(400).json({
      error: "Vai trò nhân viên không hợp lệ",
    });
  }

  const taiKhoanTonTai = await TaiKhoan.findOne({
    where: { email },
    transaction,
  });

  if (taiKhoanTonTai) {
    await transaction.rollback();

    return res.status(400).json({
      error: "Email đã được sử dụng",
    });
  }

  const mat_khau_hash = await bcrypt.hash(mat_khau, 10);

  const taiKhoan = await TaiKhoan.create(
    {
      email,
      mat_khau_hash,
      loai: "nhan_vien",
      kich_hoat: true,
    },
    { transaction },
  );

  const nhanVien = await NhanVien.create(
    {
      tai_khoan_id: taiKhoan.id,
      ho_ten,
      ngay_sinh: ngay_sinh || null,
      dia_chi,
      sdt,
      vai_tro,
      hoat_dong: true,
    },
    { transaction },
  );

  await transaction.commit();

  res.status(201).json({
    tai_khoan: {
      id: taiKhoan.id,
      email: taiKhoan.email,
      loai: taiKhoan.loai,
      kich_hoat: taiKhoan.kich_hoat,
    },
    nhan_vien: nhanVien,
  });
};

const capNhatNhanVien = async (req, res) => {
  const { id } = req.params;

  const { ho_ten, ngay_sinh, dia_chi, sdt, vai_tro, hoat_dong } = req.body;

  const nhanVien = await NhanVien.findByPk(id);

  if (!nhanVien) {
    return res.status(404).json({
      error: "Không tìm thấy nhân viên",
    });
  }

  if (vai_tro) {
    const vaiTroHopLe = ["quan_ly", "ban_hang", "kho"];

    if (!vaiTroHopLe.includes(vai_tro)) {
      return res.status(400).json({
        error: "Vai trò nhân viên không hợp lệ",
      });
    }
  }

  await nhanVien.update({
    ho_ten,
    ngay_sinh,
    dia_chi,
    sdt,
    vai_tro,
    hoat_dong,
  });

  res.json(nhanVien);
};

const khoaMoNhanVien = async (req, res) => {
  const { id } = req.params;

  const nhanVien = await NhanVien.findByPk(id, {
    include: [
      {
        model: TaiKhoan,
        as: "tai_khoan",
      },
    ],
  });

  if (!nhanVien) {
    return res.status(404).json({
      error: "Không tìm thấy nhân viên",
    });
  }

  const trangThaiMoi = !nhanVien.hoat_dong;

  await nhanVien.update({
    hoat_dong: trangThaiMoi,
  });

  if (nhanVien.tai_khoan) {
    await nhanVien.tai_khoan.update({
      kich_hoat: trangThaiMoi,
    });
  }

  res.json(nhanVien);
};

const doiMatKhauNhanVien = async (req, res) => {
  const { id } = req.params;
  const { mat_khau_moi } = req.body;

  if (!mat_khau_moi) {
    return res.status(400).json({
      error: "Vui lòng nhập mật khẩu mới",
    });
  }

  const nhanVien = await NhanVien.findByPk(id, {
    include: [
      {
        model: TaiKhoan,
        as: "tai_khoan",
      },
    ],
  });

  if (!nhanVien) {
    return res.status(404).json({
      error: "Không tìm thấy nhân viên",
    });
  }

  if (!nhanVien.tai_khoan) {
    return res.status(404).json({
      error: "Không tìm thấy tài khoản của nhân viên",
    });
  }

  const mat_khau_hash = await bcrypt.hash(mat_khau_moi, 10);

  await nhanVien.tai_khoan.update({
    mat_khau_hash,
  });

  res.json({
    message: "Đổi mật khẩu nhân viên thành công",
  });
};

const xoaNhanVien = async (req, res) => {
  const { id } = req.params;

  const nhanVien = await NhanVien.findByPk(id, {
    include: [
      {
        model: TaiKhoan,
        as: "tai_khoan",
      },
    ],
  });

  if (!nhanVien) {
    return res.status(404).json({
      error: "Không tìm thấy nhân viên",
    });
  }

  await nhanVien.update({
    hoat_dong: false,
  });

  if (nhanVien.tai_khoan) {
    await nhanVien.tai_khoan.update({
      kich_hoat: false,
    });
  }

  res.json({
    message: "Đã vô hiệu hóa nhân viên thành công",
  });
};

module.exports = {
  layTatCaNhanVien,
  layChiTietNhanVien,
  themNhanVien,
  capNhatNhanVien,
  khoaMoNhanVien,
  doiMatKhauNhanVien,
  xoaNhanVien,
};
