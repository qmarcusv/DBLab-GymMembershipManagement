// userController.js
const db = require("../../db/pg"); // Database connection

// Controller to make a user a trainer
const becomeTrainer = async (req, res) => {
	const { SSN } = req.body; // Assuming SSN is passed to identify the user

	if (!SSN) {
		return res
			.status(400)
			.json({ msg: "SSN is required to become a trainer." });
	}

	try {
		// Update the user's role to 'trainer'
		const updateRoleQuery =
			"UPDATE USERS SET role = 'trainer' WHERE SSN = $1 RETURNING SSN, role";
		const result = await db.query(updateRoleQuery, [SSN]);

		if (result.rows.length === 0) {
			return res.status(404).json({ msg: "User not found." });
		}

		res.json({
			msg: `User with SSN ${SSN} is now a trainer.`,
			user: result.rows[0],
		});
	} catch (error) {
		console.error("Error in becoming trainer:", error);
		res.status(500).send("Server error");
	}
};

// Controller to make a user a member
const becomeMember = async (req, res) => {
	const { SSN } = req.body; // Assuming SSN is passed to identify the user

	if (!SSN) {
		return res.status(400).json({ msg: "SSN is required to become a member." });
	}

	try {
		// Update the user's role to 'member'
		const updateRoleQuery =
			"UPDATE USERS SET role = 'member' WHERE SSN = $1 RETURNING SSN, role";
		const result = await db.query(updateRoleQuery, [SSN]);

		if (result.rows.length === 0) {
			return res.status(404).json({ msg: "User not found." });
		}

		res.json({
			msg: `User with SSN ${SSN} is now a member.`,
			user: result.rows[0],
		});
	} catch (error) {
		console.error("Error in becoming member:", error);
		res.status(500).send("Server error");
	}
};

module.exports = { becomeTrainer, becomeMember };
