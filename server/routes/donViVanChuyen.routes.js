const express = require("express");
const router = express.Router();

const {
  layDonViVanChuyenHoatDong,
} = require("../controllers/donViVanChuyen.controller");

router.get("/hoat-dong", layDonViVanChuyenHoatDong);

module.exports = router;
