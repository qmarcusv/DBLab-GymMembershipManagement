const express = require("express");
const cors = require("cors");
const logger = require("morgan");

const app = express();
app.use(logger("dev")).use(express.json()).use(cors());
// ROUTER
const authRoutes = require("./routes/authRoutes");
// const userRoutes = require("./routes/userRoutes");
// const membershipRoutes = require("./routes/membershipRoutes");
// const gymRoutes = require("./routes/gymRoutes");

app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/memberships", membershipRoutes);
// app.use("/api/gym", gymRoutes);

module.exports = app; // Exporting the app instance
