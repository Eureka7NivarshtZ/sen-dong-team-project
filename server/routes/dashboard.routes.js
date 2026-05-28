const router = require("express").Router();

const {
  yeuCauDangNhap,
  kiemTraVaiTro,
  yeuCauNhanVien,
} = require("../utils/middleware");

const {
  tongQuanDashboard,
  donHangGanDay,
  doanhThuTheoThang,
} = require("../controllers/dashboard.controller");

// ========== QUẢN LÝ: Thống kê quản lý ==========
router.use(yeuCauDangNhap);
router.use(yeuCauNhanVien);
router.use(kiemTraVaiTro("quan_ly"));

router.get("/", tongQuanDashboard);
router.get("/don-hang-gan-day", donHangGanDay);
router.get("/doanh-thu-theo-thang", doanhThuTheoThang);

module.exports = router;
