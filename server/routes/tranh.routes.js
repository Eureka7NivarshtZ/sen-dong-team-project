const router = require("express").Router();

const {
  xemTatCaTranh,
  xemChiTietTranh,
  taoTranh,
  capNhatTranh,
  anTranh,
  xoaTranh,
} = require("../controllers/tranh.controller");

const {
  themHinhAnhTranh,
  capNhatHinhAnhTranh,
  datAnhChinh,
  xoaHinhAnhTranh,
} = require("../controllers/hinhAnhTranh.controller");

const {
  yeuCauDangNhap,
  kiemTraVaiTro,
  yeuCauNhanVien,
} = require("../utils/middleware");

router.get("/", xemTatCaTranh);
router.get("/:id", xemChiTietTranh);

router.use(yeuCauDangNhap);
router.use(yeuCauNhanVien);
router.post("/", taoTranh);
router.put("/:id", capNhatTranh);
router.delete("/:id", xoaTranh);
router.post("/:tranhId/hinh-anh", themHinhAnhTranh);
router.delete("/hinh-anh/:id", xoaHinhAnhTranh);
// router.put("/hinh-anh/:id", capNhatHinhAnhTranh);
// router.put("/hinh-anh/:id/chinh", datAnhChinh);

module.exports = router;
