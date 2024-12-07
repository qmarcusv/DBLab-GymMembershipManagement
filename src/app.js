const express = require("express");
const cors = require("cors");
const logger = require("morgan");

const app = express();
app.use(logger("dev")).use(express.json()).use(cors());

// ROUTER
const rootRouter = require("./routes/root");

app.use("/api/", rootRouter);
// app.use("/api/user", userRoutes);

module.exports = app;
