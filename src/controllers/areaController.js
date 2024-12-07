const pool = require("../../db/pg");

const getAllAreas = async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM AREA");
		res.json(result.rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getAreasByBranch = async (req, res) => {
	try {
		const { branchId } = req.params;
		const result = await pool.query(
			"SELECT * FROM AREA WHERE GymBranchID = $1",
			[branchId]
		);
		res.json(result.rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const createArea = async (req, res) => {
	try {
		const { GymBranchID, Floor, Name } = req.body;
		const result = await pool.query(
			"INSERT INTO AREA (GymBranchID, Floor, Name) VALUES ($1, $2, $3) RETURNING *",
			[GymBranchID, Floor, Name]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
const updateArea = async (req, res) => {
	try {
		const { areaId } = req.params;
		const { GymBranchID, Floor, Name } = req.body;
		const result = await pool.query(
			"UPDATE AREA SET GymBranchID = $1, Floor = $2, Name = $3 WHERE AreaID = $4 RETURNING *",
			[GymBranchID, Floor, Name, areaId]
		);
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
const deleteArea = async (req, res) => {
	try {
		const { areaId } = req.params;
		await pool.query("DELETE FROM AREA WHERE AreaID = $1", [areaId]);
		res.json({ msg: "Area deleted successfully." });
	} catch (err) {
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
