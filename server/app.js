const express = require("express");
const taiKhoanRouter = require("./routes/tai_khoan");
const hoaDonRouter = require("./routes/hoa_don");

const app = express();
app.use(express.json());

app.use("/users", taiKhoanRouter);
app.use("/orders", hoaDonRouter);

module.exports = app;
