const router = require("express").Router();

const { xemTatCaDonHang } = require("../controllers/donHang.controller");

const { yeuCauDangNhap, yeuCauKhachHang } = require("../utils/middleware");

router.use(yeuCauDangNhap);
router.use(yeuCauKhachHang);

// router.post("/", taoDonHang);
// router.get("/cua-toi", xemDonCuaToi);
// router.get("/:id", xemChiTietDonCuaToi);
// router.put("/:id/huy", huyDonCuaToi);

module.exports = router;
