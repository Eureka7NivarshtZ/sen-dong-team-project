const router = require("express").Router();

const {
  xemTatCaDanhMuc,
  xemChiTietDanhMuc,
  themDanhMuc,
  xoaDanhMuc,
  capNhatDanhMuc,
} = require("../controllers/danhMuc.controller");

const { yeuCauDangNhap, kiemTraVaiTro } = require("../utils/middleware");

router.get("/", xemTatCaDanhMuc);
router.get("/:id", xemChiTietDanhMuc);

router.use(yeuCauDangNhap);
router.use(kiemTraVaiTro("quan_ly"));

router.post("/", themDanhMuc);
router.put("/:id", capNhatDanhMuc);
router.delete("/:id", xoaDanhMuc);

module.exports = router;
