const router = require("express").Router();

const {
  xemTatCaDanhMuc,
  xemChiTietDanhMuc,
} = require("../controllers/danhMuc.controller");

router.get("/", xemTatCaDanhMuc);
router.get("/:id", xemChiTietDanhMuc);

module.exports = router;
