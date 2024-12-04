// userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

// Route to make a user a trainer
router.post("/become-trainer", userController.becomeTrainer);

// Route to make a user a member
router.post("/become-member", userController.becomeMember);

module.exports = router;
