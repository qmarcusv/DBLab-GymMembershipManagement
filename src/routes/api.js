const express = require("express");
const api = express.Router();

api.get("/", (req, res) => {
	res.json(`Hello👋, api/`);
});
module.exports = api;
