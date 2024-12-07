const express = require("express");
const classSchedController = require("../controllers/classSchedController");

const router = express.Router();

router.get("/", classSchedController.getAllClassSchedules);
router.get("/:ProgramID", classSchedController.getClassScheduleByProgramID);
router.post("/", classSchedController.createClassSchedule);
router.put("/:ProgramID", classSchedController.updateClassSchedule);
router.delete("/:ProgramID", classSchedController.deleteClassSchedule);

module.exports = router;
