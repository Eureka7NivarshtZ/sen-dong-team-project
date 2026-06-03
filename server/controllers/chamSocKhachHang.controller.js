const { ChamSocKhachHang } = require("../models"); 

// 1. Tạo phòng chat mới (Khách gửi lần đầu)
const guiTinNhanMoi = async (req, res, next) => {
  try {
    const { chu_de, noi_dung, ho_ten, email } = req.body;
    
    const khach_hang_id = req.user ? req.user.khach_hang_id : null;
    const email_nguoi_gui = email || (req.user ? req.user.email : "Anonymouse@gmail.com");
    const ten_nguoi_gui = ho_ten || email_nguoi_gui.split('@')[0];

    // Khởi tạo tin nhắn đầu tiên trong mảng Chat Log
    const chatLog = [{ sender: "user", text: noi_dung, createdAt: new Date() }];

    const record = await ChamSocKhachHang.create({
      khach_hang_id,
      ho_ten: ten_nguoi_gui,
      email: email_nguoi_gui,
      chu_de: chu_de || "Yêu cầu hỗ trợ",
      noi_dung: JSON.stringify(chatLog), // Lưu dạng chuỗi JSON
      trang_thai: "chua_tra_loi"
    });

    return res.json({ success: true, message: "Tạo phòng hỗ trợ thành công", data: record });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Khách hàng nhắn tiếp vào phòng chat cũ
const userPhanHoiTiep = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const ticket = await ChamSocKhachHang.findByPk(id);
    if (!ticket) return res.status(404).json({ success: false, error: "Không tìm thấy cuộc trò chuyện" });

    let chatLog = [];
    try {
      chatLog = JSON.parse(ticket.noi_dung);
    } catch (e) {
      chatLog = [{ sender: "user", text: ticket.noi_dung, createdAt: ticket.createdAt }];
    }

    // Đẩy tin nhắn mới của User vào mảng
    chatLog.push({ sender: "user", text: message, createdAt: new Date() });

    await ticket.update({
      noi_dung: JSON.stringify(chatLog),
      trang_thai: "chua_tra_loi" // Đổi lại trạng thái để Admin biết có tin mới chưa đọc
    });

    return res.json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

// 3. Khách hàng xem danh sách chat của mình
const layLichSuCuaToi = async (req, res, next) => {
  try {
    const danhSach = await ChamSocKhachHang.findAll({
      where: { khach_hang_id: req.user.khach_hang_id },
      order: [["updatedAt", "DESC"]]
    });
    return res.json({ success: true, data: danhSach });
  } catch (error) {
    next(error);
  }
};

// 4. Admin lấy toàn bộ danh sách phòng chat công khai
const layDanhSachTinNhanAdmin = async (req, res, next) => {
  try {
    const danhSach = await ChamSocKhachHang.findAll({
      order: [["updatedAt", "DESC"]]
    });
    return res.json({ success: true, data: danhSach });
  } catch (error) {
    next(error);
  }
};

// 5. Admin chat trả lời khách hàng
const traLoiKhachHangAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { noiDungPhanHoi } = req.body;

    const ticket = await ChamSocKhachHang.findByPk(id);
    if (!ticket) return res.status(404).json({ success: false, error: "Không tìm thấy phòng chat" });

    let chatLog = [];
    try {
      chatLog = JSON.parse(ticket.noi_dung);
    } catch (e) {
      chatLog = [{ sender: "user", text: ticket.noi_dung, createdAt: ticket.createdAt }];
    }

    // Đẩy tin nhắn phản hồi của Admin vào mảng
    chatLog.push({ sender: "admin", text: noiDungPhanHoi, createdAt: new Date() });

    await ticket.update({
      noi_dung: JSON.stringify(chatLog),
      trang_thai: "da_tra_loi"
    });

    return res.json({ success: true, message: "Gửi phản hồi thành công", data: ticket });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  guiTinNhanMoi,
  userPhanHoiTiep,
  layLichSuCuaToi,
  layDanhSachTinNhanAdmin,
  traLoiKhachHangAdmin
};