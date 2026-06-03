const { ChamSocKhachHang } = require("../models"); 

// 1. Khách hàng gửi lời nhắn hỗ trợ mới
const guiTinNhanMoi = async (req, res, next) => {
  try {
    const { chu_de, noi_dung, ho_ten, email } = req.body;
    
    const khach_hang_id = req.user ? req.user.khach_hang_id : null;
    const ten_nguoi_gui = req.user ? (req.user.hoTen || req.user.ten) : ho_ten;
    const email_nguoi_gui = req.user ? req.user.email : email;

    const record = await ChamSocKhachHang.create({
      khach_hang_id,
      ho_ten: ten_nguoi_gui,
      email: email_nguoi_gui,
      chu_de,
      noi_dung,
      trang_thai: "chua_tra_loi"
    });

    return res.json({ success: true, message: "Gửi tin nhắn hỗ trợ thành công", data: record });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Lỗi Database thực tế: " + error.message });
  }
};

// 2. Khách hàng xem lịch sử hỗ trợ của mình
const layLichSuCuaToi = async (req, res, next) => {
  try {
    const danhSach = await ChamSocKhachHang.findAll({
      where: { khach_hang_id: req.user.khach_hang_id },
      order: [["createdAt", "DESC"]]
    });
    return res.json({ success: true, data: danhSach });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Admin xem toàn bộ danh sách lời nhắn hỗ trợ
const layDanhSachTinNhanAdmin = async (req, res, next) => {
  try {
    const danhSach = await ChamSocKhachHang.findAll({
      order: [["createdAt", "DESC"]]
    });
    return res.json({ success: true, data: danhSach });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 4. Admin gửi nội dung trả lời phản hồi cho khách
const traLoiKhachHangAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { noiDungPhanHoi } = req.body;

    const ticket = await ChamSocKhachHang.findByPk(id);
    if (!ticket) return res.status(404).json({ success: false, error: "Không tìm thấy tin nhắn hỗ trợ" });

    await ticket.update({
      tra_loi: noiDungPhanHoi,
      trang_thai: "da_tra_loi"
    });

    return res.json({ success: true, message: "Phản hồi khách hàng thành công", data: ticket });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  guiTinNhanMoi,
  layLichSuCuaToi,
  layDanhSachTinNhanAdmin,
  traLoiKhachHangAdmin
};