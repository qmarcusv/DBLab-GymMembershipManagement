const pool = require("../../db/pg");

const getAllGymStores = async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM GYMSTORE");
		res.json(result.rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getGymStoreById = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await pool.query(
			"SELECT * FROM GYMSTORE WHERE GymstoreID = $1",
			[id]
		);
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const createGymStore = async (req, res) => {
	try {
		const { Name, DiscountAmount, ProgramID } = req.body;
		const result = await pool.query(
			"INSERT INTO GYMSTORE (Name, DiscountAmount, ProgramID) VALUES ($1, $2, $3) RETURNING *",
			[Name, DiscountAmount, ProgramID]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const updateGymStore = async (req, res) => {
	try {
		const { id } = req.params;
		const { Name, DiscountAmount, ProgramID } = req.body;
		const result = await pool.query(
			"UPDATE GYMSTORE SET Name = $1, DiscountAmount = $2, ProgramID = $3 WHERE GymstoreID = $4 RETURNING *",
			[Name, DiscountAmount, ProgramID, id]
		);
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const deleteGymStore = async (req, res) => {
	try {
		const { id } = req.params;
		await pool.query("DELETE FROM GYMSTORE WHERE GymstoreID = $1", [id]);
		res.json({ message: "Gym Store deleted successfully" });
	} catch (err) {
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
