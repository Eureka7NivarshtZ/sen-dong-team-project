const express = require("express");
const cors = require("cors");
const middleware = require("./utils/middleware");

const authRoutes = require("./routes/auth.routes");
const khachHangRoutes = require("./routes/khachHang.routes");
const nhanVienRoutes = require("./routes/nhanVien.routes");
const tranhRoutes = require("./routes/tranh.routes");
const danhMucRoutes = require("./routes/danhMuc.routes");
const tacGiaRoutes = require("./routes/tacGia.routes");
const gioHangRoutes = require("./routes/gioHang.routes");
const donHangRoutes = require("./routes/donHang.routes");

const adminRoutes = require("./routes/admin.routes");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);

app.use("/api/khach-hang", khachHangRoutes);
app.use("/api/tranh", tranhRoutes);
app.use("/api/danh-muc", danhMucRoutes);
app.use("/api/tac-gia", tacGiaRoutes);
app.use("/api/gio-hang", gioHangRoutes);
app.use("/api/don-hang", donHangRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/nhan-vien", nhanVienRoutes);

app.use(middleware.xuLyLoi);

module.exports = app;
