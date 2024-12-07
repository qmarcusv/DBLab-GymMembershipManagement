const pool = require("../../db/pg");

const getAllGymBranches = async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM GYMBRANCH");
		res.json(result.rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getGymBranchById = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await pool.query(
			"SELECT * FROM GYMBRANCH WHERE GymBranchID = $1",
			[id]
		);
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const createGymBranch = async (req, res) => {
	try {
		const { GymBranchID, Address } = req.body;
		const result = await pool.query(
			"INSERT INTO GYMBRANCH (GymBranchID, Address) VALUES ($1, $2) RETURNING *",
			[GymBranchID, Address]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
const updateGymBranch = async (req, res) => {
	try {
		const { id } = req.params; // GymBranchID from the URL
		const { Address } = req.body; // New address from the request body

		// Update the gym branch in the database
		const result = await pool.query(
			"UPDATE GYMBRANCH SET Address = $1 WHERE GymBranchID = $2 RETURNING *",
			[Address, id]
		);

		// If no rows are updated, the GymBranchID does not exist
		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Gym Branch not found." });
		}

		// Send the updated Gym Branch as the response
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const deleteGymBranch = async (req, res) => {
	try {
		const { id } = req.params;
		await pool.query("DELETE FROM GYMBRANCH WHERE GymBranchID = $1", [id]);
		res.json({ message: "Gym Branch deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

module.exports = {
	getAllGymBranches,
	getGymBranchById,
	createGymBranch,
	deleteGymBranch,
	updateGymBranch,
};
