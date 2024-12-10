const pool = require("../../db/pg");

// Colors for logging
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

// Get all gym stores
const getAllGymStores = async (req, res) => {
	try {
		console.log(YELLOW + "[INFO] Fetching all gym stores." + RESET);
		const result = await pool.query("SELECT * FROM GYMSTORE");
		res.json(result.rows);
	} catch (err) {
		console.error(
			RED + "[ERROR] Error fetching gym stores: " + err.message + RESET
		);
		res.status(500).json({ error: err.message });
	}
};

// Get gym store by ID
const getGymStoreById = async (req, res) => {
	try {
		const { id } = req.params;
		console.log(YELLOW + `[INFO] Fetching gym store with ID: ${id}` + RESET);
		const result = await pool.query(
			"SELECT * FROM GYMSTORE WHERE GymstoreID = $1",
			[id]
		);

		if (result.rows.length === 0) {
			console.log(
				RED + `[ERROR] Gym store not found with ID: ` + JSON.parse(id) + RESET
			);
			return res.status(404).json({ error: "Gym Store not found." });
		}

		res.json(result.rows[0]);
	} catch (err) {
		console.error(
			RED + "[ERROR] Error fetching gym store: " + err.message + RESET
		);
		res.status(500).json({ error: err.message });
	}
};
// Create a new gym store
const createGymStore = async (req, res) => {
	try {
		const { GymstoreID, Name, DiscountAmount, ProgramID } = req.body;

		// Check if the ProgramID exists in the BASIC table
		const programCheckQuery = "SELECT * FROM BASIC WHERE ProgramID = $1";
		const programCheckResult = await pool.query(programCheckQuery, [ProgramID]);

		if (programCheckResult.rows.length === 0) {
			console.log(
				RED + `[ERROR] ProgramID ${ProgramID} not found in BASIC table.` + RESET
			);
			return res
				.status(400)
				.json({ error: "Invalid ProgramID. Program does not exist." });
		}

		// Proceed to insert gym store
		console.log(YELLOW + "[INFO] Creating new gym store." + RESET);
		const result = await pool.query(
			"INSERT INTO GYMSTORE (GymstoreID, Name, DiscountAmount, ProgramID) VALUES ($1, $2, $3, $4) RETURNING *",
			[GymstoreID, Name, DiscountAmount, ProgramID]
		);
		console.log(
			GREEN +
				`[SUCCESS] Gym store created with ID: ` +
				JSON.parse(result.rows[0].gymstoreid) +
				RESET
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error(
			RED + "[ERROR] Error creating gym store: " + err.message + RESET
		);
		res.status(500).json({ error: err.message });
	}
};

// Update gym store details
const updateGymStore = async (req, res) => {
	try {
		const { id } = req.params;
		const { Name, DiscountAmount, ProgramID } = req.body;

		// Check if the ProgramID exists in the BASIC table
		const programCheckQuery = "SELECT * FROM BASIC WHERE ProgramID = $1";
		const programCheckResult = await pool.query(programCheckQuery, [ProgramID]);

		if (programCheckResult.rows.length === 0) {
			console.log(
				RED + `[ERROR] ProgramID ${ProgramID} not found in BASIC table.` + RESET
			);
			return res
				.status(400)
				.json({ error: "Invalid ProgramID. Program does not exist." });
		}

		// Proceed to update gym store
		console.log(YELLOW + `[INFO] Updating gym store with ID: ${id}` + RESET);
		const result = await pool.query(
			"UPDATE GYMSTORE SET Name = $1, DiscountAmount = $2, ProgramID = $3 WHERE GymstoreID = $4 RETURNING *",
			[Name, DiscountAmount, ProgramID, id]
		);

		if (result.rows.length === 0) {
			console.log(RED + `[ERROR] Gym store not found with ID: ${id}` + RESET);
			return res.status(404).json({ error: "Gym Store not found." });
		}

		console.log(GREEN + `[SUCCESS] Gym store updated with ID: ${id}` + RESET);
		res.json(result.rows[0]);
	} catch (err) {
		console.error(
			RED + "[ERROR] Error updating gym store: " + err.message + RESET
		);
		res.status(500).json({ error: err.message });
	}
};

// Delete gym store
const deleteGymStore = async (req, res) => {
	try {
		const { id } = req.params;
		console.log(YELLOW + `[INFO] Deleting gym store with ID: ${id}` + RESET);
		await pool.query("DELETE FROM GYMSTORE WHERE GymstoreID = $1", [id]);

		console.log(GREEN + `[SUCCESS] Gym store deleted with ID: ${id}` + RESET);
		res.json({ message: "Gym Store deleted successfully" });
	} catch (err) {
		console.error(
			RED + "[ERROR] Error deleting gym store: " + err.message + RESET
		);
		res.status(500).json({ error: err.message });
	}
};

module.exports = {
	getAllGymStores,
	getGymStoreById,
	createGymStore,
	updateGymStore,
	deleteGymStore,
};
