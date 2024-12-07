const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");

// Routes for member CRUD operations
router.post("/become-member", memberController.becomeMember); // Create member
router.get("/", memberController.getAllMembers); // Get all members
router.get("/:memberID", memberController.getMemberByID); // Get a specific member
router.put("/:memberID", memberController.updateMember); // Update member details
router.delete("/:memberID", memberController.deleteMember); // Delete a member

module.exports = router;
