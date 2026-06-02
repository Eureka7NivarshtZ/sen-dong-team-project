const bcrypt = require("bcrypt");
const { sequelize, TaiKhoan, NhanVien } = require("./models");

const seedAdmin = async () => {
  try {
    await sequelize.authenticate();

    const email = "admin@example.com";
    const matKhau = "12345678";

    const taiKhoanTonTai = await TaiKhoan.findOne({
      where: { email },
    });

    if (taiKhoanTonTai) {
      console.log("Tài khoản admin đã tồn tại");
      process.exit(0);
    }

    const mat_khau_hash = await bcrypt.hash(matKhau, 10);

    const ketQua = await sequelize.transaction(async (t) => {
      const taiKhoan = await TaiKhoan.create(
        {
          email,
          mat_khau_hash,
          loai: "nhan_vien",
          kich_hoat: true,
        },
        { transaction: t },
      );

      const nhanVien = await NhanVien.create(
        {
          tai_khoan_id: taiKhoan.id,
          ho_ten: "Quản lý hệ thống",
          ngay_sinh: null,
          dia_chi: null,
          sdt: null,
          vai_tro: "quan_ly",
          hoat_dong: true,
        },
        { transaction: t },
      );

      return { taiKhoan, nhanVien };
    });

    console.log("Tạo tài khoản quản lý thành công");
    console.log("Email:", email);
    console.log("Mật khẩu:", matKhau);
    console.log("Vai trò:", ketQua.nhanVien.vai_tro);

    process.exit(0);
  } catch (error) {
    console.error("Lỗi seed admin:", error);
    process.exit(1);
  }
};

seedAdmin();
