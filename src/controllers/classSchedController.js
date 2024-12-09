const db = require("../../db/pg");

// Colors for logging
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

// Get all class schedules
const getAllClassSchedules = async (req, res) => {
	try {
		console.log(
			YELLOW + "[INFO] Fetching all class schedules from database." + RESET
		);
		const result = await db.query("SELECT * FROM CLASS_SCHED");
		res.json(result.rows);
	} catch (error) {
		console.error(
			RED + "[ERROR] Error fetching class schedules: " + error.message + RESET
		);
		res.status(500).send("Server error");
	}
};

// Get class schedule by ProgramID
const getClassScheduleByProgramID = async (req, res) => {
	const { ProgramID } = req.params;

	try {
		console.log(
			YELLOW +
				`[INFO] Fetching class schedule for ProgramID: ${ProgramID}` +
				RESET
		);
		const result = await db.query(
			"SELECT * FROM CLASS_SCHED WHERE ProgramID = $1",
			[ProgramID]
		);

		if (result.rows.length === 0) {
			console.log(
				RED +
					`[ERROR] Class schedule not found for ProgramID: ${ProgramID}` +
					RESET
			);
			return res.status(404).json({ msg: "Class schedule not found." });
		}

		res.json({ classSchedule: result.rows[0] });
	} catch (error) {
		console.error(
			RED + "[ERROR] Error fetching class schedule: " + error.message + RESET
		);
		res.status(500).send("Server error");
	}
};

// Create a new class schedule
const createClassSchedule = async (req, res) => {
	const { ProgramID, DayOfWeek, TimeOfDay, SessionDuration } = req.body;

	try {
		console.log(YELLOW + "[INFO] Creating a new class schedule." + RESET);
		const result = await db.query(
			`INSERT INTO CLASS_SCHED (ProgramID, DayOfWeek, TimeOfDay, SessionDuration)
			VALUES ($1, $2, $3, $4) RETURNING *`,
			[ProgramID, DayOfWeek, TimeOfDay, SessionDuration]
		);

		console.log(
			GREEN +
				`[SUCCESS] Class schedule created for ProgramID: ${ProgramID}.` +
				RESET
		);
		res.json({
			msg: "Class schedule created successfully.",
			classSchedule: result.rows[0],
		});
	} catch (error) {
		console.error(
			RED + "[ERROR] Error creating class schedule: " + error.message + RESET
		);
		res.status(500).send("Server error");
	}
};

// Update class schedule details
const updateClassSchedule = async (req, res) => {
	const { ProgramID } = req.params;
	const { DayOfWeek, TimeOfDay, SessionDuration } = req.body;

	try {
		console.log(
			YELLOW +
				`[INFO] Updating class schedule for ProgramID: ${ProgramID}.` +
				RESET
		);
		const result = await db.query(
			`UPDATE CLASS_SCHED
			SET DayOfWeek = $1, TimeOfDay = $2, SessionDuration = $3
			WHERE ProgramID = $4 RETURNING *`,
			[DayOfWeek, TimeOfDay, SessionDuration, ProgramID]
		);

		if (result.rows.length === 0) {
			console.log(
				RED +
					`[ERROR] Class schedule not found for ProgramID: ${ProgramID}` +
					RESET
			);
			return res.status(404).json({ msg: "Class schedule not found." });
		}

		console.log(
			GREEN +
				`[SUCCESS] Class schedule updated for ProgramID: ${ProgramID}.` +
				RESET
		);
		res.json({
			msg: "Class schedule updated successfully.",
			classSchedule: result.rows[0],
		});
	} catch (error) {
		console.error(
			RED + "[ERROR] Error updating class schedule: " + error.message + RESET
		);
		res.status(500).send("Server error");
	}
};

// Delete class schedule
const deleteClassSchedule = async (req, res) => {
	const { ProgramID } = req.params;

	try {
		console.log(
			YELLOW +
				`[INFO] Deleting class schedule for ProgramID: ${ProgramID}.` +
				RESET
		);
		const result = await db.query(
			"DELETE FROM CLASS_SCHED WHERE ProgramID = $1 RETURNING ProgramID",
			[ProgramID]
		);

		if (result.rows.length === 0) {
			console.log(
				RED +
					`[ERROR] Class schedule not found for ProgramID: ${ProgramID}` +
					RESET
			);
			return res.status(404).json({ msg: "Class schedule not found." });
		}

		console.log(
			GREEN +
				`[SUCCESS] Class schedule deleted for ProgramID: ${ProgramID}.` +
				RESET
		);
		res.json({ msg: "Class schedule deleted successfully." });
	} catch (error) {
		console.error(
			RED + "[ERROR] Error deleting class schedule: " + error.message + RESET
		);
		res.status(500).send("Server error");
	}
};

module.exports = {
	getAllClassSchedules,
	getClassScheduleByProgramID,
	createClassSchedule,
	updateClassSchedule,
	deleteClassSchedule,
};
