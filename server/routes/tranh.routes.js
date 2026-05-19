const router = require("express").Router();
const middleware = require("../utils/middleware");

const {
  layTatCaTranh,
  taoTranh,
  layChiTietTranh,
  capNhatTranh,
  xoaTranh,
} = require("../controllers/tranh.controller");


router.get("/", layTatCaTranh);
router.get("/:id", layChiTietTranh);
router.post(
  "/",
  middleware.layNguoiDungTuToken,
  middleware.yeuCauNhanVien,
  taoTranh
);
router.put(
  "/:id",
  middleware.layNguoiDungTuToken,
  middleware.yeuCauQuanLy,
  capNhatTranh
);
router.delete(
  "/:id",
  middleware.layNguoiDungTuToken,
  middleware.yeuCauQuanLy,
  xoaTranh
);

module.exports = router;
