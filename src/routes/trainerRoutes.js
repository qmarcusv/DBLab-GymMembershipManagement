const express = require("express");
const router = express.Router();
const trainerController = require("../controllers/trainerController");

// Routes for trainer CRUD operations
router.post("/become-trainer", trainerController.becomeTrainer); // Create trainer
router.get("/", trainerController.getAllTrainers); // Get all trainers
router.get("/:trainerID", trainerController.getTrainerByID); // Get a specific trainer
router.put("/:trainerID", trainerController.updateTrainer); // Update trainer details
router.delete("/:trainerID", trainerController.deleteTrainer); // Delete a trainer

module.exports = router;
