const router = require("express").Router();

const {
  layTatCaThietBi,
  layChiTietThietBi,
  themThietBi,
  capNhatThietBi,
  xoaThietBi,
} = require("../controllers/thietBi.controller");

const {
  yeuCauDangNhap,
  kiemTraVaiTro,
  yeuCauNhanVien,
} = require("../utils/middleware");

router.use(yeuCauDangNhap);

router.get("/", yeuCauNhanVien, layTatCaThietBi);
router.get("/:id", yeuCauNhanVien, layChiTietThietBi);

router.post("/", kiemTraVaiTro("quan_ly"), themThietBi);
router.put("/:id", kiemTraVaiTro("quan_ly"), capNhatThietBi);
router.delete("/:id", kiemTraVaiTro("quan_ly"), xoaThietBi);

module.exports = router;

