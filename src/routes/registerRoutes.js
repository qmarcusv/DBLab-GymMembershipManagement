const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");

// Get all registrations
router.get("/", registerController.registerForMembership);
router.get("/:SSN", registerController.getAllRegistrationsForSSN);
module.exports = router;
