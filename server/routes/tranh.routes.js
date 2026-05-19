const router = require("express").Router();

const {
  xemTatCaTranh,
  xemChiTietTranh,
} = require("../controllers/tranh.controller");

router.get("/", xemTatCaTranh);
router.get("/:id", xemChiTietTranh);

module.exports = router;
