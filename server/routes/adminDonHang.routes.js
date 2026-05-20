const router = require("express").Router();

const { xemTatCaDonHang } = require("../controllers/donHang.controller");

const { yeuCauDangNhap, kiemTraVaiTro } = require("../utils/middleware");

router.use(yeuCauDangNhap);
router.use(kiemTraVaiTro(["quan_ly", "ban_hang"]));

router.get("/", xemTatCaDonHang);
// router.get("/:id", xemChiTietDonBatKy);
// router.put("/:id/trang-thai", capNhatTrangThaiDon);
// router.put("/:id/huy", huyDonBatKy);

module.exports = router;
