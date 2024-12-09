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
const userRoutes = require("./userRoutes");
const router = express.Router();

// Import the routes
router.use("/auth", authRoute);
router.use("/gymbranches", gymBranchRoute);
router.use("/users", userRoutes);
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
