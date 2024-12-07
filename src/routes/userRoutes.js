// userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

router.get("/", userController.getAllUsers);
router.get("/:userSSN", userController.getUserBySSN);
router.put("/:userSSN", userController.updateUser);
router.delete("/:userSSN", userController.deleteUser);

module.exports = router;
