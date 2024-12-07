const db = require("../../db/pg");

// Get all classes
const getAllClasses = async (req, res) => {
	try {
		const result = await db.query("SELECT * FROM CLASS");
		res.json(result.rows);
	} catch (error) {
		console.error("Error fetching classes:", error);
		res.status(500).send("Server error");
	}
};

// Get class by ProgramID
const getClassByProgramID = async (req, res) => {
	const { ProgramID } = req.params;

	try {
		const result = await db.query("SELECT * FROM CLASS WHERE ProgramID = $1", [
			ProgramID,
		]);

		if (result.rows.length === 0) {
			return res.status(404).json({ msg: "Class not found." });
		}

		res.json({ class: result.rows[0] });
	} catch (error) {
		console.error("Error fetching class:", error);
		res.status(500).send("Server error");
	}
};

// Create a new class
const createClass = async (req, res) => {
	const {
		ProgramID,
		PeriodNum,
		SessionDuration,
		GymBranchID,
		Floor,
		Area,
		TrainerID,
	} = req.body;

	try {
		const result = await db.query(
			`INSERT INTO CLASS (ProgramID, PeriodNum, SessionDuration, GymBranchID, Floor, Area, TrainerID)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
			[
				ProgramID,
				PeriodNum,
				SessionDuration,
				GymBranchID,
				Floor,
				Area,
				TrainerID,
			]
		);

		res.json({ msg: "Class created successfully.", class: result.rows[0] });
	} catch (error) {
		console.error("Error creating class:", error);
		res.status(500).send("Server error");
	}
};

// Update class details
const updateClass = async (req, res) => {
	const { ProgramID } = req.params;
	const { PeriodNum, SessionDuration, GymBranchID, Floor, Area, TrainerID } =
		req.body;

	try {
		const result = await db.query(
			`UPDATE CLASS
       SET PeriodNum = $1, SessionDuration = $2, GymBranchID = $3, Floor = $4, Area = $5, TrainerID = $6
       WHERE ProgramID = $7 RETURNING *`,
			[
				PeriodNum,
				SessionDuration,
				GymBranchID,
				Floor,
				Area,
				TrainerID,
				ProgramID,
			]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ msg: "Class not found." });
		}

		res.json({ msg: "Class updated successfully.", class: result.rows[0] });
	} catch (error) {
		console.error("Error updating class:", error);
		res.status(500).send("Server error");
	}
};

// Delete class
const deleteClass = async (req, res) => {
	const { ProgramID } = req.params;

	try {
		const result = await db.query(
			"DELETE FROM CLASS WHERE ProgramID = $1 RETURNING ProgramID",
			[ProgramID]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ msg: "Class not found." });
		}

		res.json({ msg: "Class deleted successfully." });
	} catch (error) {
		console.error("Error deleting class:", error);
		res.status(500).send("Server error");
	}
};

module.exports = {
	getAllClasses,
	getClassByProgramID,
	createClass,
	updateClass,
	deleteClass,
};
