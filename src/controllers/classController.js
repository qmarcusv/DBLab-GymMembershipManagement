const db = require("../../db/pg");

// Colors for logging
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

// Get all classes
const getAllClasses = async (req, res) => {
	try {
		console.log(YELLOW + "[INFO] Fetching all classes from database." + RESET);
		const result = await db.query("SELECT * FROM CLASS");
		res.json(result.rows);
	} catch (error) {
		console.error(
			RED + "[ERROR] Error fetching classes: " + error.message + RESET
		);
		res.status(500).send("Server error");
	}
};

// Get class by ProgramID
const getClassByProgramID = async (req, res) => {
	const { ProgramID } = req.params;

	try {
		console.log(
			YELLOW + `[INFO] Fetching class with ProgramID: ${ProgramID}.` + RESET
		);
		const result = await db.query("SELECT * FROM CLASS WHERE ProgramID = $1", [
			ProgramID,
		]);

		if (result.rows.length === 0) {
			console.log(
				RED + `[ERROR] Class not found for ProgramID: ${ProgramID}` + RESET
			);
			return res.status(404).json({ msg: "Class not found." });
		}

		res.json({ class: result.rows[0] });
	} catch (error) {
		console.error(
			RED + "[ERROR] Error fetching class: " + error.message + RESET
		);
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
		console.log(YELLOW + "[INFO] Creating a new class." + RESET);
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

		console.log(
			GREEN + `[SUCCESS] Class created with ProgramID: ${ProgramID}.` + RESET
		);
		res.json({ msg: "Class created successfully.", class: result.rows[0] });
	} catch (error) {
		console.error(
			RED + "[ERROR] Error creating class: " + error.message + RESET
		);
		res.status(500).send("Server error");
	}
};

// Update class details
const updateClass = async (req, res) => {
	const { ProgramID } = req.params;
	const { PeriodNum, SessionDuration, GymBranchID, Floor, Area, TrainerID } =
		req.body;

	try {
		console.log(
			YELLOW + `[INFO] Updating class with ProgramID: ${ProgramID}.` + RESET
		);
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
			console.log(
				RED + `[ERROR] Class not found for ProgramID: ${ProgramID}` + RESET
			);
			return res.status(404).json({ msg: "Class not found." });
		}

		console.log(
			GREEN + `[SUCCESS] Class updated for ProgramID: ${ProgramID}.` + RESET
		);
		res.json({ msg: "Class updated successfully.", class: result.rows[0] });
	} catch (error) {
		console.error(
			RED + "[ERROR] Error updating class: " + error.message + RESET
		);
		res.status(500).send("Server error");
	}
};

// Delete class
const deleteClass = async (req, res) => {
	const { ProgramID } = req.params;

	try {
		console.log(
			YELLOW + `[INFO] Deleting class with ProgramID: ${ProgramID}.` + RESET
		);
		const result = await db.query(
			"DELETE FROM CLASS WHERE ProgramID = $1 RETURNING ProgramID",
			[ProgramID]
		);

		if (result.rows.length === 0) {
			console.log(
				RED + `[ERROR] Class not found for ProgramID: ${ProgramID}` + RESET
			);
			return res.status(404).json({ msg: "Class not found." });
		}

		console.log(
			GREEN + `[SUCCESS] Class deleted with ProgramID: ${ProgramID}.` + RESET
		);
		res.json({ msg: "Class deleted successfully." });
	} catch (error) {
		console.error(
			RED + "[ERROR] Error deleting class: " + error.message + RESET
		);
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
