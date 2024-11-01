// imports
const express = require("express");

// DB connection Test
const pg = require("../db/pg");
// const sqlite3 = require("../db/sqlite3");

app = express();

// ROUTER
app.use("/", require("./routes/root"));
app.use("/api", require("./routes/api"));
app.use("/api/users", require("./routes/users"));

// export app
module.exports = app;
