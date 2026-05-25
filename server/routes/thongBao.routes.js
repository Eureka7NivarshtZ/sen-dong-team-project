const express = require("express");
const router = express.Router();

const {
  xemThongBaoCuaToi,
  demThongBaoChuaDoc,
  danhDauDaDoc,
  danhDauTatCaDaDoc,
} = require("../controllers/thongBao.controller");

const { yeuCauDangNhap } = require("../utils/middleware");

router.use(yeuCauDangNhap);
router.get("/", xemThongBaoCuaToi);
router.get("/chua-doc/dem", demThongBaoChuaDoc);
router.patch("/:id/da-doc", danhDauDaDoc);
router.patch("/da-doc/tat-ca", danhDauTatCaDaDoc);

module.exports = router;
