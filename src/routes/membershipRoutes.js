const express = require("express");
const membershipController = require("../controllers/membershipController");

const router = express.Router();

router.get("/", membershipController.getAllMemberships); // Get all memberships
router.get("/:id", membershipController.getMembershipById); // Get membership by ID
router.post("/register", membershipController.registerMembership); // Register for membership
router.post("/", membershipController.createMembership); // Create a new membership
router.delete("/:id", membershipController.deleteMembership); // Delete a membership

module.exports = router;
