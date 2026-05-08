const router = require("express").Router();
const hoaDonController = require("../controllers/hoa_don");

router.get("/", hoaDonController.getAll);

module.exports = router;
