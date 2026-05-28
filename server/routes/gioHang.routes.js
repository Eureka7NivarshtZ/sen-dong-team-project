const router = require("express").Router();

const {
  xemGioHangCuaToi,
  themVaoGioHang,
  capNhatSoLuong,
  xoaKhoiGioHang,
  xoaTatCaGioHang,
} = require("../controllers/gioHang.controller");

const { yeuCauDangNhap, yeuCauKhachHang } = require("../utils/middleware");

// ========== KHÁCH HÀNG: Quản lý giỏ hàng ==========
router.use(yeuCauDangNhap);
router.use(yeuCauKhachHang);

router.get("/", xemGioHangCuaToi);
router.post("/them", themVaoGioHang);
router.put("/:id", capNhatSoLuong);
router.delete("/:id", xoaKhoiGioHang);
router.delete("/", xoaTatCaGioHang);

module.exports = router;
