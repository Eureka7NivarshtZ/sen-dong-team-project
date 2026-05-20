const router = require("express").Router();

const {
  themHinhAnhTranh,
  capNhatHinhAnhTranh,
  datAnhChinh,
  xoaHinhAnhTranh,
} = require("../controllers/hinhAnhTranh.controller");

const {
  taoTranh,
  capNhatTranh,
  anTranh,
  xoaTranh,
} = require("../controllers/tranh.controller");

const { yeuCauDangNhap, kiemTraVaiTro } = require("../utils/middleware");

router.use(yeuCauDangNhap);
router.use(kiemTraVaiTro("quan_ly"));

router.post("/:tranhId/hinh-anh", themHinhAnhTranh);
router.put("/hinh-anh/:id", capNhatHinhAnhTranh);
router.put("/hinh-anh/:id/chinh", datAnhChinh);
router.delete("/hinh-anh/:id", xoaHinhAnhTranh);

router.post("/", taoTranh);
router.put("/:id", capNhatTranh);
router.put("/:id/an", anTranh);
router.delete("/:id", xoaTranh);

module.exports = router;
