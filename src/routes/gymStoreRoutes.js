const express = require("express");
const gymStoreController = require("../controllers/gymStoreController");

const router = express.Router();

router.get("/", gymStoreController.getAllGymStores);
router.get("/:id", gymStoreController.getGymStoreById);
router.post("/", gymStoreController.createGymStore);
router.put("/:id", gymStoreController.updateGymStore);
router.delete("/:id", gymStoreController.deleteGymStore);

module.exports = router;
