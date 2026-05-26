const router = require("express").Router();

const {
  layVatLieuCanhBao,
  layChiTietVatLieu,
  themVatLieu,
  capNhatVatLieu,
  xoaVatLieu,
} = require("../controllers/vatLieu.controller");

const {
  yeuCauDangNhap,
  kiemTraVaiTro,
  yeuCauNhanVien,
} = require("../utils/middleware");

router.use(yeuCauDangNhap);

router.get("/", yeuCauNhanVien, layVatLieuCanhBao);

router.post("/", kiemTraVaiTro("quan_ly"), themVatLieu);
router.get("/:id", kiemTraVaiTro("quan_ly"), layChiTietVatLieu);
router.put("/:id", kiemTraVaiTro("quan_ly"), capNhatVatLieu);
router.delete("/:id", kiemTraVaiTro("quan_ly"), xoaVatLieu);

module.exports = router;
