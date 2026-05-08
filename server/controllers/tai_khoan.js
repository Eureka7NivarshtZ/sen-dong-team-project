const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt"); // Thư viện dùng để mã hóa mật khẩu
const taiKhoanModel = require("../models/tai_khoan"); // Import cái file code lúc nãy của bạn

const duyetTaiKhoan = async (req, res) => {
  const tatCaTaiKhoan = await taiKhoanModel.findAll();
  res.json(tatCaTaiKhoan);
};

// Hàm xử lý API Đăng ký / Tạo tài khoản
const taoTaiKhoan = async (req, res) => {
  try {
    // 1. Lấy dữ liệu từ REST API (người dùng gửi lên qua body)
    const { email, mat_khau, loai } = req.body;

    // (Tùy chọn) Kiểm tra dữ liệu đầu vào xem có trống không
    if (!email || !mat_khau || !loai) {
      return res.status(400).json({ message: "Vui lòng nhập đủ thông tin!" });
    }

    // 2. Mã hóa mật khẩu trước khi lưu vào DB (Rất quan trọng)
    const salt = await bcrypt.genSalt(10);
    const mat_khau_hash = await bcrypt.hash(mat_khau, salt);

    // 3. Tạo ID tự động
    const id = uuidv4();

    // 4. Gọi hàm create từ Model để lưu vào Database
    const taiKhoanMoi = await taiKhoanModel.create({
      id: id,
      email: email,
      mat_khau_hash: mat_khau_hash,
      loai: loai,
    });

    // 5. Trả về kết quả cho Client (Frontend) qua chuẩn REST
    res.status(201).json({
      message: "Tạo tài khoản thành công!",
      data: taiKhoanMoi,
    });
  } catch (error) {
    console.error("Lỗi khi tạo tài khoản:", error);
    // Bắt lỗi trùng email (MySQL báo lỗi Duplicate entry)
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email này đã được sử dụng!" });
    }
    res.status(500).json({ message: "Lỗi server!" });
  }
};

module.exports = { duyetTaiKhoan, taoTaiKhoan };
