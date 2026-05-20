const router = require("express").Router();

const {
  xemTatCaTacGia,
  xemChiTietTacGia,
} = require("../controllers/tacGia.controller");

router.get("/", xemTatCaTacGia);
router.get("/:id", xemChiTietTacGia);

module.exports = router;
