const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");

// Get all classes
router.get("/", classController.getAllClasses);
router.get("/:ProgramID", classController.getClassByProgramID);
router.post("/", classController.createClass);
router.put("/:ProgramID", classController.updateClass);
router.delete("/:ProgramID", classController.deleteClass);

module.exports = router;
