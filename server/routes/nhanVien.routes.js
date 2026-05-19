const router = require("express").Router();
const { taoNhanVien } = require("../controllers/nhanVien.controller");

router.post("/dang-ky", taoNhanVien);

module.exports = router;
