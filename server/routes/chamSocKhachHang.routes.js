const router = require("express").Router();
const {
  guiTinNhanMoi,
  layLichSuCuaToi,
  userPhanHoiTiep,
  layDanhSachTinNhanAdmin,
  traLoiKhachHangAdmin
} = require("../controllers/chamSocKhachHang.controller");
const middleware = require("../utils/middleware");

// ========== KHÁCH HÀNG (Client User) ==========
router.post("/gui", guiTinNhanMoi);
router.get("/cua-toi", middleware.yeuCauDangNhap, layLichSuCuaToi);
router.post("/:id/user-tra-loi", middleware.yeuCauDangNhap, userPhanHoiTiep); // Cổng nhắn tin qua lại của User

// ========== QUẢN TRỊ VIÊN (Admin) ==========
router.get("/admin/danh-sach", middleware.yeuCauDangNhap, layDanhSachTinNhanAdmin);
router.post("/admin/:id/tra-loi", middleware.yeuCauDangNhap, traLoiKhachHangAdmin);

module.exports = router;