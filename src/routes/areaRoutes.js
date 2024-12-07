const express = require("express");
const areaController = require("../controllers/areaController");

const router = express.Router();

router.post("/", areaController.createArea);
router.get("/", areaController.getAllAreas);
router.get("/branch/:branchId", areaController.getAreasByBranch);
router.put("/:areaId", areaController.updateArea);
router.delete("/:areaId", areaController.deleteArea);

module.exports = router;
