const pool = require("../../db/pg");

// Colors for logging
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

// Get all areas
const getAllAreas = async (req, res) => {
	try {
		console.log(GREEN + "[INFO] Fetching all areas..." + RESET); // Log action
		const result = await pool.query("SELECT * FROM AREA");
		console.log(GREEN + "[SUCCESS] Retrieved areas." + RESET); // Success log
		res.json(result.rows);
	} catch (err) {
		console.log(RED + "[ERROR] Failed to fetch areas: " + err.message + RESET); // Error log
		res.status(500).json({ error: err.message });
	}
};

// Get areas by branch
const getAreasByBranch = async (req, res) => {
	try {
		const { branchId } = req.params;
		console.log(
			YELLOW + `[INFO] Fetching areas for branch ID: ${branchId}...` + RESET
		); // Log action
		const result = await pool.query(
			"SELECT * FROM AREA WHERE GymBranchID = $1",
			[branchId]
		);
		console.log(
			GREEN + "[SUCCESS] Retrieved areas for branch ID: " + branchId + RESET
		); // Success log
		res.json(result.rows);
	} catch (err) {
		console.log(
			RED +
				`[ERROR] Failed to fetch areas for branch ${branchId}: ` +
				err.message +
				RESET
		); // Error log
		res.status(500).json({ error: err.message });
	}
};

// Create a new area
const createArea = async (req, res) => {
	try {
		const { GymBranchID, Floor, Name } = req.body;
		console.log(
			YELLOW +
				`[INFO] Creating new area at Branch ID: ${GymBranchID}, Floor: ${Floor}, Name: ${Name}...` +
				RESET
		); // Log action
		const result = await pool.query(
			"INSERT INTO AREA (GymBranchID, Floor, Name) VALUES ($1, $2, $3) RETURNING *",
			[GymBranchID, Floor, Name]
		);
		console.log(
			GREEN +
				"[SUCCESS] Area created: " +
				JSON.stringify(result.rows[0]) +
				RESET
		); // Success log
		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.log(RED + `[ERROR] Failed to create area: ` + err.message + RESET); // Error log
		res.status(500).json({ error: err.message });
	}
};

// Update an area
const updateArea = async (req, res) => {
	try {
		const { areaId } = req.params;
		const { GymBranchID, Floor, Name } = req.body;
		console.log(YELLOW + `[INFO] Updating area ID: ${areaId}...` + RESET); // Log action
		const result = await pool.query(
			"UPDATE AREA SET GymBranchID = $1, Floor = $2, Name = $3 WHERE AreaID = $4 RETURNING *",
			[GymBranchID, Floor, Name, areaId]
		);
		console.log(
			GREEN +
				`[SUCCESS] Area ID ${areaId} updated: ` +
				JSON.stringify(result.rows[0]) +
				RESET
		); // Success log
		res.json(result.rows[0]);
	} catch (err) {
		console.log(
			RED + `[ERROR] Failed to update area ID ${areaId}: ` + err.message + RESET
		); // Error log
		res.status(500).json({ error: err.message });
	}
};

// Delete an area
const deleteArea = async (req, res) => {
	try {
		const { areaId } = req.params;
		console.log(YELLOW + `[INFO] Deleting area ID: ${areaId}...` + RESET); // Log action
		await pool.query("DELETE FROM AREA WHERE AreaID = $1", [areaId]);
		console.log(
			GREEN + `[SUCCESS] Area ID ${areaId} deleted successfully.` + RESET
		); // Success log
		res.json({ msg: "Area deleted successfully." });
	} catch (err) {
		console.log(
			RED + `[ERROR] Failed to delete area ID ${areaId}: ` + err.message + RESET
		); // Error log
		res.status(500).json({ error: err.message });
	}
};

module.exports = {
	getAllAreas,
	getAreasByBranch,
	createArea,
	updateArea,
	deleteArea,
};
