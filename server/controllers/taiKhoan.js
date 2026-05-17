const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const taiKhoanModel = require("../models/taiKhoan");

const duyetTaiKhoan = async (req, res) => {
  const tatCaTaiKhoan = await taiKhoanModel.findAll();
  res.json(tatCaTaiKhoan);
};

// Hàm xử lý API Đăng ký / Tạo tài khoản
const taoTaiKhoan = async (req, res) => {
  const { email, mat_khau, loai } = req.body;

  if (!email || !mat_khau || !loai) {
    return res.status(400).json({ message: "Vui lòng nhập đủ thông tin!" });
  }

  const salt = await bcrypt.genSalt(10);
  const mat_khau_hash = await bcrypt.hash(mat_khau, salt);

  const id = uuidv4();

  const taiKhoanMoi = await taiKhoanModel.create({
    id: id,
    email: email,
    mat_khau_hash: mat_khau_hash,
    loai: loai,
  });

  res.status(201).json({
    message: "Tạo tài khoản thành công!",
    data: taiKhoanMoi,
  });
};

module.exports = { duyetTaiKhoan, taoTaiKhoan };
