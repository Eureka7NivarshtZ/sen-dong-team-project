const router = require("express").Router();

const { yeuCauDangNhap, yeuCauNhanVien } = require("../utils/middleware");

const {
  layTatCaTranh,
  taoTranh,
  layChiTietTranh,
  capNhatTranh,
  xoaTranh,
} = require("../controllers/tranh.controller");

router.use(yeuCauDangNhap);
router.use(yeuCauNhanVien);

router.get("/", layTatCaTranh);
router.get("/:id", layChiTietTranh);
router.post("/", taoTranh);
router.put("/:id", capNhatTranh);
router.delete("/:id", xoaTranh);

module.exports = router;
