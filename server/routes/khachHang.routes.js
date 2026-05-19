const router = require("express").Router();

const { dangKyKhachHang } = require("../controllers/khachHang.controller");

router.post("/dang-ky", dangKyKhachHang);

module.exports = router;
