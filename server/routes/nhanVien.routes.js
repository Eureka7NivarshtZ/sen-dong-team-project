const router = require("express").Router();
const { chieuTuyenNhanVien } = require("../controllers/nhanVien.controller");

// Public endpoint: chiêu tuyển nhân viên mới
router.post("/dang-ky", chieuTuyenNhanVien);

module.exports = router;
