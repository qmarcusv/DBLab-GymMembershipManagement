const db = require("../../db/pg"); // PostgreSQL database connection

// Colors for logging
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

// Become a Trainer controller
const becomeTrainer = async (req, res) => {
	const { SSN, Specialization, EmploymentType, GymBranchID } = req.body;

	// Validate required fields
	if (!SSN || !Specialization || !EmploymentType || !GymBranchID) {
		console.log(
			RED +
				"[ERROR] Missing required fields: SSN, Specialization, EmploymentType, or GymBranchID." +
				RESET
		);
		return res.status(400).json({
			msg: "SSN, Specialization, EmploymentType, and GymBranchID are required.",
		});
	}

	const validSpecializations = [
		"Gym",
		"Pilate",
		"Yoga",
		"Meditate",
		"Kickboxing",
		"Boxing",
		"Calisthenic",
	];
	if (!validSpecializations.includes(Specialization)) {
		console.log(
			RED + `[ERROR] Invalid specialization: ${Specialization}` + RESET
		);
		return res.status(400).json({ msg: "Invalid specialization." });
	}

	try {
		console.log(
			YELLOW + "[INFO] Checking if user is already a trainer." + RESET
		);

		// Check if the user is already a trainer
		const existingTrainer = await db.query(
			"SELECT * FROM TRAINER WHERE SSN = $1",
			[SSN]
		);

		if (existingTrainer.rows.length > 0) {
			console.log(
				YELLOW + `[INFO] User SSN ${SSN} is already a trainer.` + RESET
			);
			return res.status(400).json({
				msg: `User SSN ${SSN} is already a trainer.`,
			});
		}

		// Insert the new trainer into the database
		console.log(
			YELLOW + "[INFO] Registering new trainer in the database." + RESET
		);
		const insertTrainerQuery = `
            INSERT INTO TRAINER (SSN, Specialization, EmploymentType, Workplace)
            VALUES ($1, $2, $3, $4) RETURNING TrainerID
        `;
		const result = await db.query(insertTrainerQuery, [
			SSN,
			Specialization,
			EmploymentType,
			GymBranchID,
		]);

		const newTrainer = result.rows[0];

		// Log the action when a new trainer is added in green
		console.log(
			GREEN +
				`>> User SSN ${SSN} is now a trainer. TrainerID: ${newTrainer.TrainerID}` +
				RESET
		);

		res.json({
			msg: `User with SSN ${SSN} is now a trainer.`,
			trainerID: newTrainer.TrainerID,
		});
	} catch (error) {
		console.error(
			RED + "[ERROR] Error in becoming trainer: " + error.message + RESET
		);
		res.status(500).send("Server error");
	}
};

// Get All Trainers controller
const getAllTrainers = async (req, res) => {
	try {
		console.log(YELLOW + "[INFO] Fetching all trainers." + RESET);
		const result = await db.query("SELECT * FROM TRAINER");

		console.log(GREEN + "[INFO] Retrieved all trainers successfully." + RESET);
		res.json(result.rows);
	} catch (error) {
		console.error(
			RED + "[ERROR] Error fetching all trainers: " + error.message + RESET
		);
		res.status(500).send("Server error");
	}
};

// Get Trainer by ID controller
const getTrainerByID = async (req, res) => {
	const { trainerID } = req.params;

	try {
		console.log(YELLOW + `[INFO] Fetching trainer by ID: ${trainerID}` + RESET);
		const result = await db.query(
			"SELECT * FROM TRAINER WHERE TrainerID = $1",
			[trainerID]
		);

		if (result.rows.length === 0) {
			console.log(
				RED + `[ERROR] Trainer with ID ${trainerID} not found.` + RESET
			);
			return res.status(404).json({ msg: "Trainer not found." });
		}

		console.log(
			GREEN + `[INFO] Retrieved trainer with ID ${trainerID}.` + RESET
		);
		res.json(result.rows[0]);
	} catch (error) {
		console.error(
			RED + "[ERROR] Error fetching trainer by ID: " + error.message + RESET
		);
		res.status(500).send("Server error");
	}
};

// Update Trainer controller
const updateTrainer = async (req, res) => {
	const { trainerID } = req.params;
	const { Specialization, EmploymentType, GymBranchID } = req.body;

	try {
		console.log(
			YELLOW + `[INFO] Updating trainer with ID: ${trainerID}` + RESET
		);
		const result = await db.query(
			`UPDATE TRAINER SET Specialization = $1, EmploymentType = $2, Workplace = $3
             WHERE TrainerID = $4 RETURNING TrainerID`,
			[Specialization, EmploymentType, GymBranchID, trainerID]
		);

		if (result.rows.length === 0) {
			console.log(
				RED +
					`[ERROR] Trainer with ID ${trainerID} not found for update.` +
					RESET
			);
			return res.status(404).json({ msg: "Trainer not found." });
		}

		console.log(
			GREEN +
				`[INFO] Trainer with ID ${trainerID} updated successfully.` +
				RESET
		);
		res.json({
			msg: `Trainer with ID ${trainerID} updated successfully.`,
			trainer: result.rows[0],
		});
	} catch (error) {
		console.error(
			RED + "[ERROR] Error updating trainer: " + error.message + RESET
		);
		res.status(500).send("Server error");
	}
};

// Delete Trainer controller
const deleteTrainer = async (req, res) => {
	const { trainerID } = req.params;

	try {
		console.log(
			YELLOW + `[INFO] Deleting trainer with ID: ${trainerID}` + RESET
		);
		const result = await db.query(
			"DELETE FROM TRAINER WHERE TrainerID = $1 RETURNING TrainerID",
			[trainerID]
		);

		if (result.rows.length === 0) {
			console.log(
				RED +
					`[ERROR] Trainer with ID ${trainerID} not found for deletion.` +
					RESET
			);
			return res.status(404).json({ msg: "Trainer not found." });
		}

		console.log(
			GREEN +
				`[INFO] Trainer with ID ${trainerID} deleted successfully.` +
				RESET
		);
		res.json({ msg: `Trainer with ID ${trainerID} deleted successfully.` });
	} catch (error) {
		console.error(
			RED + "[ERROR] Error deleting trainer: " + error.message + RESET
		);
		res.status(500).send("Server error");
	}
};

module.exports = {
	becomeTrainer,
	getAllTrainers,
	getTrainerByID,
	updateTrainer,
	deleteTrainer,
};
