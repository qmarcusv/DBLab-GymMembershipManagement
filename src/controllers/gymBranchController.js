const pool = require("../../db/pg");

// Colors for logging
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

// Get all gym branches
const getAllGymBranches = async (req, res) => {
	try {
		console.log(YELLOW + "[INFO] Fetching all gym branches." + RESET);
		const result = await pool.query("SELECT * FROM GYMBRANCH");
		res.json(result.rows);
	} catch (err) {
		console.error(
			RED + "[ERROR] Error fetching gym branches: " + err.message + RESET
		);
		res.status(500).json({ error: err.message });
	}
};

// Get gym branch by ID
const getGymBranchById = async (req, res) => {
	try {
		const { id } = req.params;
		console.log(YELLOW + `[INFO] Fetching gym branch with ID: ${id}` + RESET);
		const result = await pool.query(
			"SELECT * FROM GYMBRANCH WHERE GymBranchID = $1",
			[id]
		);

		if (result.rows.length === 0) {
			console.log(RED + `[ERROR] Gym branch not found with ID: ${id}` + RESET);
			return res.status(404).json({ error: "Gym Branch not found." });
		}

		res.json(result.rows[0]);
	} catch (err) {
		console.error(
			RED + "[ERROR] Error fetching gym branch: " + err.message + RESET
		);
		res.status(500).json({ error: err.message });
	}
};

// Create a new gym branch
const createGymBranch = async (req, res) => {
	try {
		const { GymBranchID, Address } = req.body;
		console.log(YELLOW + "[INFO] Creating new gym branch." + RESET);
		const result = await pool.query(
			"INSERT INTO GYMBRANCH (GymBranchID, Address) VALUES ($1, $2) RETURNING *",
			[GymBranchID, Address]
		);

		console.log(
			GREEN +
				`[SUCCESS] Gym branch created with ID: ${result.rows[0].GymBranchID}` +
				RESET
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error(
			RED + "[ERROR] Error creating gym branch: " + err.message + RESET
		);
		res.status(500).json({ error: err.message });
	}
};

// Update gym branch details
const updateGymBranch = async (req, res) => {
	try {
		const { id } = req.params;
		const { Address } = req.body;

		console.log(YELLOW + `[INFO] Updating gym branch with ID: ${id}` + RESET);
		const result = await pool.query(
			"UPDATE GYMBRANCH SET Address = $1 WHERE GymBranchID = $2 RETURNING *",
			[Address, id]
		);

		if (result.rows.length === 0) {
			console.log(RED + `[ERROR] Gym branch not found with ID: ${id}` + RESET);
			return res.status(404).json({ error: "Gym Branch not found." });
		}

		console.log(GREEN + `[SUCCESS] Gym branch updated with ID: ${id}` + RESET);
		res.json(result.rows[0]);
	} catch (err) {
		console.error(
			RED + "[ERROR] Error updating gym branch: " + err.message + RESET
		);
		res.status(500).json({ error: err.message });
	}
};

// Delete gym branch
const deleteGymBranch = async (req, res) => {
	try {
		const { id } = req.params;
		console.log(YELLOW + `[INFO] Deleting gym branch with ID: ${id}` + RESET);
		await pool.query("DELETE FROM GYMBRANCH WHERE GymBranchID = $1", [id]);

		console.log(GREEN + `[SUCCESS] Gym branch deleted with ID: ${id}` + RESET);
		res.json({ message: "Gym Branch deleted successfully" });
	} catch (err) {
		console.error(
			RED + "[ERROR] Error deleting gym branch: " + err.message + RESET
		);
		res.status(500).json({ error: err.message });
	}
};

module.exports = {
	getAllGymBranches,
	getGymBranchById,
	createGymBranch,
	updateGymBranch,
	deleteGymBranch,
};
