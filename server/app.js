const express = require("express");
const cors = require("cors");
const middleware = require("./utils/middleware");

const authRoutes = require("./routes/auth.routes");
const tranhRoutes = require("./routes/tranh.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(middleware.layToken);

app.use("/api/auth", authRoutes);
app.use("/api/tranh", tranhRoutes);

app.use(middleware.xuLyLoi);

module.exports = app;
