const express = require("express");
const cors = require("cors");
const middleware = require("./utils/middleware");

const authRoutes = require("./routes/auth.routes");
const tranhRoutes = require("./routes/tranh.routes");
const danhMucRoutes = require("./routes/danhMuc.routes");
const tacGiaRoutes = require("./routes/tacGia.routes");
const gioHangRoutes = require("./routes/gioHang.routes");
const donHangRoutes = require("./routes/donHang.routes");
const donViVanChuyenRoutes = require("./routes/donViVanChuyen.routes");
const danhGiaRoutes = require("./routes/danhGia.routes");
const khuyenMaiRoutes = require("./routes/khuyenMai.routes");
const thongBaoRoutes = require("./routes/thongBao.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const hoaDonRoutes = require("./routes/hoaDon.routes");
const khachHangRoutes = require("./routes/khachHang.routes");
const nhanVienRoutes = require("./routes/nhanVien.routes");
const thanhToanRoutes = require("./routes/thanhToan.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tranh", tranhRoutes);
app.use("/api/danh-muc", danhMucRoutes);
app.use("/api/tac-gia", tacGiaRoutes);
app.use("/api/gio-hang", gioHangRoutes);
app.use("/api/don-hang", donHangRoutes);
app.use("/api/danh-gia", danhGiaRoutes);
app.use("/api/khuyen-mai", khuyenMaiRoutes);
app.use("/api/thong-bao", thongBaoRoutes);
app.use("/api/don-vi-van-chuyen", donViVanChuyenRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/hoa-don", hoaDonRoutes);
app.use("/api/khach-hang", khachHangRoutes);
app.use("/api/nhan-vien", nhanVienRoutes);
app.use("/api/thanh-toan", thanhToanRoutes);

app.use(middleware.xuLyLoi);

module.exports = app;
