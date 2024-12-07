const db = require("../../db/pg");
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

// Create a new trainer (Becoming a Trainer)
const becomeTrainer = async (req, res) => {
	const { SSN, Specialization, EmploymentType, GymBranchID } = req.body;

	if (!SSN || !Specialization || !EmploymentType || !GymBranchID) {
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
		return res.status(400).json({ msg: "Invalid specialization." });
	}

	try {
		// Check if the user is already a trainer
		const existingTrainer = await db.query(
			"SELECT * FROM TRAINER WHERE SSN = $1",
			[SSN]
		);

		if (existingTrainer.rows.length > 0) {
			// If the user is already a trainer, log this action in yellow
			console.log(`${YELLOW}>> User SSN ${SSN} is already a trainer.${RESET}`);
			return res.status(400).json({
				msg: `User SSN ${SSN} is already a trainer.`,
			});
		}

		// Insert into TRAINER table
		const insertTrainerQuery = `
          INSERT INTO TRAINER (SSN, Specialization, EmploymentType, Workplace)
          VALUES ($1, $2, $3, $4) RETURNING TrainerID`;
		const result = await db.query(insertTrainerQuery, [
			SSN,
			Specialization,
			EmploymentType,
			GymBranchID,
		]);

		const newTrainer = result.rows[0];

		// Log the action when a new trainer is added in green
		console.log(`${GREEN}>> User SSN ${SSN} is now a trainer.${RESET}`);

		res.json({
			msg: `User with SSN ${SSN} is now a trainer.`,
			trainerID: newTrainer.TrainerID,
		});
	} catch (error) {
		console.error("Error in becoming trainer:", error);
		res.status(500).send("Server error");
	}
};

const getAllTrainers = async (req, res) => {
	try {
		const result = await db.query("SELECT * FROM TRAINER");
		// Log the action when fetching all trainers
		console.log(`${GREEN}>> Retrieved all trainers.${RESET}`);
		res.json(result.rows);
	} catch (error) {
		console.error("Error fetching trainers:", error);
		res.status(500).send("Server error");
	}
};
const getTrainerByID = async (req, res) => {
	const { trainerID } = req.params;

	try {
		const result = await db.query(
			"SELECT * FROM TRAINER WHERE TrainerID = $1",
			[trainerID]
		);
		if (result.rows.length === 0) {
			// Log when the trainer is not found
			console.log(`${RED}>> Trainer with ID ${trainerID} not found.${RESET}`);
			return res.status(404).json({ msg: "Trainer not found." });
		}
		// Log when a trainer is successfully found
		console.log(`${GREEN}>> Retrieved trainer with ID ${trainerID}.${RESET}`);
		res.json(result.rows[0]);
	} catch (error) {
		console.error("Error fetching trainer:", error);
		res.status(500).send("Server error");
	}
};
const updateTrainer = async (req, res) => {
	const { trainerID } = req.params;
	const { Specialization, EmploymentType, GymBranchID } = req.body;

	try {
		const result = await db.query(
			`UPDATE TRAINER SET Specialization = $1, EmploymentType = $2, Workplace = $3
            WHERE TrainerID = $4 RETURNING TrainerID`,
			[Specialization, EmploymentType, GymBranchID, trainerID]
		);

		if (result.rows.length === 0) {
			// Log when the trainer is not found
			console.log(
				`${RED}>> Trainer with ID ${trainerID} not found for update.${RESET}`
			);
			return res.status(404).json({ msg: "Trainer not found." });
		}

		// Log when the trainer has been successfully updated
		console.log(
			`${GREEN}>> Trainer with ID ${trainerID} updated successfully.${RESET}`
		);
		res.json({
			msg: `Trainer with ID ${trainerID} updated successfully.`,
			trainer: result.rows[0],
		});
	} catch (error) {
		console.error("Error updating trainer:", error);
		res.status(500).send("Server error");
	}
};
const deleteTrainer = async (req, res) => {
	const { trainerID } = req.params;

	try {
		const result = await db.query(
			"DELETE FROM TRAINER WHERE TrainerID = $1 RETURNING TrainerID",
			[trainerID]
		);

		if (result.rows.length === 0) {
			// Log when the trainer is not found for deletion
			console.log(
				`${RED}>> Trainer with ID ${trainerID} not found for deletion.${RESET}`
			);
			return res.status(404).json({ msg: "Trainer not found." });
		}

		// Log when the trainer has been successfully deleted
		console.log(
			`${GREEN}>> Trainer with ID ${trainerID} deleted successfully.${RESET}`
		);
		res.json({ msg: `Trainer with ID ${trainerID} deleted successfully.` });
	} catch (error) {
		console.error("Error deleting trainer:", error);
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
