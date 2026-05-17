const router = require("express").Router();
const hoaDonController = require("../controllers/hoaDon");

router.get("/", hoaDonController.getAll);

module.exports = router;
