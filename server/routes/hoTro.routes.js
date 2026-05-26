const express = require("express");
const router = express.Router();

const {
  taoYeuCauHoTro,
  xemYeuCauHoTroCuaToi,
  xemChiTietYeuCauHoTro,
  khachHangPhanHoiHoTro,
  adminXemTatCaYeuCauHoTro,
  adminCapNhatYeuCauHoTro,
  adminPhanHoiHoTro,
} = require("../controllers/hoTro.controller");

const {
  yeuCauDangNhap,
  yeuCauKhachHang,
  yeuCauNhanVien,
} = require("../utils/middleware");

router.use(yeuCauDangNhap);

router.post("/", yeuCauKhachHang, taoYeuCauHoTro);

router.get("/:id", xemChiTietYeuCauHoTro);
router.get("/cua-toi", xemYeuCauHoTroCuaToi);
router.post("/:id/phan-hoi", khachHangPhanHoiHoTro);

router.get("/", yeuCauNhanVien, adminXemTatCaYeuCauHoTro);

router.patch("/:id", yeuCauNhanVien, adminCapNhatYeuCauHoTro);
router.post("/:id/phan-hoi", yeuCauNhanVien, adminPhanHoiHoTro);

module.exports = router;
