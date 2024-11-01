const express = require("express");
const root = express.Router();

root.get("/", (req, res) => {
	res.json(`Root 3 thang gay`);
});

// Authentication
// root.post("/login", authController.logIn);
// root.get("/logout", authController.logOut);

module.exports = root;
