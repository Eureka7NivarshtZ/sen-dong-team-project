const express = require("express");
const taiKhoanRouter = require("./routes/taiKhoan");
const hoaDonRouter = require("./routes/hoaDon");

const app = express();
app.use(express.json());

app.use("/users", taiKhoanRouter);
app.use("/orders", hoaDonRouter);

module.exports = app;
