const express = require("express");
const root = express.Router();

root.get("/", (req, res) => {
	res.json(`Hello👋, root/`);
});

// Authentication
// root.post("/login", authController.logIn);
// root.get("/logout", authController.logOut);

module.exports = root;
