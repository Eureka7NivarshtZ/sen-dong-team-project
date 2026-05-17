const router = require("express").Router();
const taiKhoanController = require("../controllers/taiKhoan");

router.get("/", taiKhoanController.duyetTaiKhoan);
router.post("/", taiKhoanController.taoTaiKhoan);

module.exports = router;
