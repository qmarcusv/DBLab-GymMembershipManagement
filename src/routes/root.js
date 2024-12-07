const express = require("express");
const authRoute = require("./authRoutes");
const gymBranchRoute = require("./gymBranchRoutes");
const memberRoute = require("./memberRoutes");
const trainerRoute = require("./trainerRoutes");
const membershipRoute = require("./membershipRoutes");
const areaRoute = require("./areaRoutes");
const gymStoreRoute = require("./gymStoreRoutes");
const classRoute = require("./classRoutes");
const classSchedRoute = require("./classSchedRoutes");
const registerRoutes = require("./registerRoutes");
const router = express.Router();

router.use("/auth", authRoute);
router.use("/gymbranches", gymBranchRoute);
router.use("/trainers", trainerRoute);
router.use("/members", memberRoute);
router.use("/memberships", membershipRoute);
router.use("/areas", areaRoute);
router.use("/gymstores", gymStoreRoute);
router.use("/classes", classRoute);
router.use("/classSched", classSchedRoute);
router.use("/register-membership", registerRoutes);
module.exports = router;

// Use the imported routes

module.exports = router;
