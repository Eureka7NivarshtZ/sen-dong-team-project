const express = require("express");
const cors = require("cors");
const middleware = require("./utils/middleware");

const authRoutes = require("./routes/auth.routes");
const khachHangRoutes = require("./routes/khachHang.routes");
const nhanVienRoutes = require("./routes/nhanVien.routes");
const tranhRoutes = require("./routes/tranh.routes");
const danhMucRoutes = require("./routes/danhMuc.routes");
const tacGiaRoutes = require("./routes/adminTacGia.routes");
const gioHangRoutes = require("./routes/gioHang.routes");
const donHangRoutes = require("./routes/donHang.routes");

const adminTranhRoutes = require("./routes/adminTranh.routes");
const adminDanhMucRoutes = require("./routes/adminDanhMuc.routes");
const adminTacGiaRoutes = require("./routes/adminTacGia.routes");
const adminDonHangRoutes = require("./routes/adminDonHang.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/khach-hang", khachHangRoutes);
app.use("/api/nhan-vien", nhanVienRoutes);
app.use("/api/tranh", tranhRoutes);
app.use("/api/danh-muc", danhMucRoutes);
app.use("/api/tac-gia", tacGiaRoutes);
app.use("/api/gio-hang", gioHangRoutes);
app.use("/api/don-hang", donHangRoutes);

app.use("/api/admin/tranh", adminTranhRoutes);
app.use("/api/admin/danh-muc", adminDanhMucRoutes);
app.use("/api/admin/tac-gia", adminTacGiaRoutes);
app.use("/api/admin/don-hang", adminDonHangRoutes);

app.use(middleware.xuLyLoi);

module.exports = app;
