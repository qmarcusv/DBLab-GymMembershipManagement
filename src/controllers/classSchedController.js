const db = require("../../db/pg");

// Get all class schedules
const getAllClassSchedules = async (req, res) => {
	try {
		const result = await db.query("SELECT * FROM CLASS_SCHED");
		res.json(result.rows);
	} catch (error) {
		console.error("Error fetching class schedules:", error);
		res.status(500).send("Server error");
	}
};

// Get class schedule by ProgramID
const getClassScheduleByProgramID = async (req, res) => {
	const { ProgramID } = req.params;

	try {
		const result = await db.query(
			"SELECT * FROM CLASS_SCHED WHERE ProgramID = $1",
			[ProgramID]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ msg: "Class schedule not found." });
		}

		res.json({ classSchedule: result.rows[0] });
	} catch (error) {
		console.error("Error fetching class schedule:", error);
		res.status(500).send("Server error");
	}
};

// Create a new class schedule
const createClassSchedule = async (req, res) => {
	const { ProgramID, DayOfWeek, TimeOfDay, SessionDuration } = req.body;

	try {
		const result = await db.query(
			`INSERT INTO CLASS_SCHED (ProgramID, DayOfWeek, TimeOfDay, SessionDuration)
       VALUES ($1, $2, $3, $4) RETURNING *`,
			[ProgramID, DayOfWeek, TimeOfDay, SessionDuration]
		);

		res.json({
			msg: "Class schedule created successfully.",
			classSchedule: result.rows[0],
		});
	} catch (error) {
		console.error("Error creating class schedule:", error);
		res.status(500).send("Server error");
	}
};

// Update class schedule details
const updateClassSchedule = async (req, res) => {
	const { ProgramID } = req.params;
	const { DayOfWeek, TimeOfDay, SessionDuration } = req.body;

	try {
		const result = await db.query(
			`UPDATE CLASS_SCHED
       SET DayOfWeek = $1, TimeOfDay = $2, SessionDuration = $3
       WHERE ProgramID = $4 RETURNING *`,
			[DayOfWeek, TimeOfDay, SessionDuration, ProgramID]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ msg: "Class schedule not found." });
		}

		res.json({
			msg: "Class schedule updated successfully.",
			classSchedule: result.rows[0],
		});
	} catch (error) {
		console.error("Error updating class schedule:", error);
		res.status(500).send("Server error");
	}
};

// Delete class schedule
const deleteClassSchedule = async (req, res) => {
	const { ProgramID } = req.params;

	try {
		const result = await db.query(
			"DELETE FROM CLASS_SCHED WHERE ProgramID = $1 RETURNING ProgramID",
			[ProgramID]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ msg: "Class schedule not found." });
		}

		res.json({ msg: "Class schedule deleted successfully." });
	} catch (error) {
		console.error("Error deleting class schedule:", error);
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
