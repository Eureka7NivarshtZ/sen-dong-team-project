const router = require("express").Router();

const { yeuCauDangNhap, yeuCauNhanVien } = require("../utils/middleware");

const {
  taoTranh,
  capNhatTranh,
  anTranh,
  xoaTranh,
} = require("../controllers/tranh.controller");

router.use(yeuCauDangNhap);
router.use(yeuCauNhanVien);

router.post("/", taoTranh);
router.put("/:id", capNhatTranh);
router.put("/:id/an", anTranh);
router.delete("/:id", xoaTranh);

module.exports = router;
