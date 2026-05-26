const router = require("express").Router();

const {
  layTatCaNhaCungCap,
  layChiTietNhaCungCap,
  themNhaCungCap,
  capNhatNhaCungCap,
  xoaNhaCungCap,
} = require("../controllers/nhaCungCap.controller");

const {
  yeuCauDangNhap,
  kiemTraVaiTro,
  yeuCauNhanVien,
} = require("../utils/middleware");

router.use(yeuCauDangNhap);

router.get("/", yeuCauNhanVien, layTatCaNhaCungCap);

router.get("/:id", kiemTraVaiTro("quan_ly"), layChiTietNhaCungCap);
router.post("/", kiemTraVaiTro("quan_ly"), themNhaCungCap);
router.put("/:id", kiemTraVaiTro("quan_ly"), capNhatNhaCungCap);
router.delete("/:id", kiemTraVaiTro("quan_ly"), xoaNhaCungCap);

module.exports = router;
