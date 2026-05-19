const {
  dangKyKhachHang,
  dangNhap,
  layThongTinCuaToi,
  taoNhanVien,
} = require("../controllers/auth.controller");
const middleware = require("../utils/middleware");

const router = require("express").Router();

router.post("/dang-ky", dangKyKhachHang);
router.post("/dang-nhap", dangNhap);
router.get("/thong-tin", middleware.layNguoiDungTuToken, layThongTinCuaToi);
router.post("/nhan-vien", taoNhanVien);

module.exports = router;
