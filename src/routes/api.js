const express = require("express");
const api = express.Router();

api.get("/", (req, res) => {
	res.json(`Api 3 thang gay`);
});
module.exports = api;
