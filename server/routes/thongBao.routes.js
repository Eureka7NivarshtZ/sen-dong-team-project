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
router.patch("/:id/doc", danhDauDaDoc);
router.patch("/doc-tat-ca", danhDauTatCaDaDoc);
router.get("/dem-chua-doc", demThongBaoChuaDoc);

module.exports = router;
