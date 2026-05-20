const router = require("express").Router();

const {
  themTacGia,
  capNhatTacGia,
  xoaTacGia,
} = require("../controllers/tacGia.controller");

const { yeuCauDangNhap, kiemTraVaiTro } = require("../utils/middleware");

router.use(yeuCauDangNhap);
router.use(kiemTraVaiTro("quan_ly"));

router.post("/", themTacGia);
router.put("/:id", capNhatTacGia);
router.delete("/:id", xoaTacGia);

module.exports = router;
