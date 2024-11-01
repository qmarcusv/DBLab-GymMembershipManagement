const express = require("express");
const users = express.Router();

const userController = require("../controllers/UserController");

// ROUTES
users.get("/", userController.findAll);
users.get("/:id", userController.findById);
users.post("/", userController.create);
users.put("/:id", userController.update);
users.delete("/:id", userController.delete);

module.exports = users;
