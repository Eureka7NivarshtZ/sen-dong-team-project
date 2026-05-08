const router = require("express").Router();
const taiKhoanController = require("../controllers/tai_khoan");

router.get("/", taiKhoanController.duyetTaiKhoan);
router.post("/", taiKhoanController.taoTaiKhoan);

module.exports = router;
