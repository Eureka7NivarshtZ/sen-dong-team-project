// backend/routes/adminChamSoc.routes.js
const router = require("express").Router();
const { layDanhSachTinNhanAdmin, traLoiKhachHangAdmin } = require("../controllers/chamSocKhachHang.controller");
const { yeuCauDangNhap } = require("../utils/middleware"); // Hoặc dùng middleware yeuCauNhanVien của riêng team bạn

router.use(yeuCauDangNhap); // Khóa xích bảo vệ, bắt buộc tài khoản quản trị mới gọi được

router.get("/", layDanhSachTinNhanAdmin);
router.post("/:id/tra-loi", traLoiKhachHangAdmin);

module.exports = router;