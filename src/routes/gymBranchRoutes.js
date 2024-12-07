const express = require("express");
const gymBranchController = require("../controllers/gymBranchController");

const router = express.Router();

router.post("/", gymBranchController.createGymBranch);
router.get("/", gymBranchController.getAllGymBranches);
router.get("/:id", gymBranchController.getGymBranchById);
router.put("/:id", gymBranchController.updateGymBranch);
router.delete("/:id", gymBranchController.deleteGymBranch);

module.exports = router;
