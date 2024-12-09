// userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.getAllUsers);
router.get("/:SSN", userController.getUserBySSN);
router.put("/:SSN", userController.updateUser);
router.delete("/:SSN", userController.deleteUser);

module.exports = router;
