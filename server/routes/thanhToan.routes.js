const router = require("express").Router();

const {
  taoThanhToan,
  layTatCaThanhToan,
  layChiTietThanhToan,
  capNhatTrangThaiThanhToan,
} = require("../controllers/thanhToan.controller");

const {
  yeuCauDangNhap,
  kiemTraVaiTro,
  yeuCauNhanVien,
} = require("../utils/middleware");

// ========== NHÂN VIÊN: Xem và tạo thanh toán ==========
router.use(yeuCauDangNhap);
router.use(yeuCauNhanVien);

router.get("/", layTatCaThanhToan);
router.post("/", taoThanhToan);
router.get("/:id", layChiTietThanhToan);

// ========== QUẢN LÝ / BAN HÀNG: Cập nhật trạng thái thanh toán ==========
router.put(
  "/:id/trang-thai",
  kiemTraVaiTro(["quan_ly", "ban_hang"]),
  capNhatTrangThaiThanhToan,
);

module.exports = router;
