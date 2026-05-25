const express = require("express");
const router = express.Router();

const { kiemTraMaKhuyenMai } = require("../controllers/khuyenMai.controller");

const { yeuCauDangNhap } = require("../utils/middleware");

router.post("/kiem-tra", yeuCauDangNhap, kiemTraMaKhuyenMai);

module.exports = router;
