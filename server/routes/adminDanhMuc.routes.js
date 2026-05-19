const router = require("express").Router();

const {
  themDanhMuc,
  xoaDanhMuc,
  capNhatDanhMuc,
} = require("../controllers/danhMuc.controller");

const { yeuCauDangNhap, yeuCauNhanVien } = require("../utils/middleware");

router.use(yeuCauDangNhap);
router.use(yeuCauNhanVien);

router.post("/", themDanhMuc);
router.put("/:id", capNhatDanhMuc);
router.delete("/:id", xoaDanhMuc);

module.exports = router;
