const router = require("express").Router();

const {
  themTacGia,
  xoaTacGia,
  capNhatTacGia,
  xemTatCaTacGia,
  xemChiTietTacGia,
} = require("../controllers/tacGia.controller");

const { yeuCauDangNhap, kiemTraVaiTro } = require("../utils/middleware");

router.get("/", xemTatCaTacGia);
router.get("/:id", xemChiTietTacGia);

router.use(yeuCauDangNhap);
router.use(kiemTraVaiTro("quan_ly"));
router.post("/", themTacGia);
router.put("/:id", capNhatTacGia);
router.delete("/:id", xoaTacGia);

module.exports = router;
