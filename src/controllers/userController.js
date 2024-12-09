const db = require("../../db/pg");

// Colors for logging
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

// Get all users
const getAllUsers = async (req, res) => {
	try {
		console.log(YELLOW + "[INFO] Fetching all users." + RESET);
		const result = await db.query("SELECT * FROM USERS");
		console.log(GREEN + "[SUCCESS] Fetched all users." + RESET);
		res.json(result.rows);
	} catch (error) {
		console.error(
			RED + "[ERROR] Error fetching users: " + error.message + RESET
		);
		res.status(500).send("Server error");
	}
};

// Get User by SSN
const getUserBySSN = async (req, res) => {
	try {
		const { SSN } = req.params;
		console.log(
			YELLOW + `[INFO] Fetching user by SSN: ` + JSON.parse(SSN) + RESET
		);
		const result = await db.query("SELECT * FROM USERS WHERE SSN = $1", [SSN]);

		if (result.rows.length === 0) {
			console.log(RED + "[ERROR] User not found for SSN: " + SSN + RESET);
			return res.status(404).json({ msg: "User not found." });
		}

		console.log(GREEN + `[SUCCESS] User found: SSN ` + JSON.parse(SSN) + RESET);
		res.json({ user: result.rows[0] });
	} catch (error) {
		console.error(
			RED + "[ERROR] Error fetching user: " + error.message + RESET
		);
		res.status(500).send("Server error");
	}
};

// Update User
const updateUser = async (req, res) => {
	const { SSN } = req.params;
	const { FName, LName, PhoneNum, DoB } = req.body;

	try {
		console.log(
			YELLOW + `[INFO] Updating user with SSN: ` + JSON.parse(SSN) + RESET
		);
		const result = await db.query(
			`UPDATE USERS SET FName = $1, LName = $2, PhoneNum = $3, DoB = $4 WHERE SSN = $5 RETURNING SSN`,
			[FName, LName, PhoneNum, DoB, SSN]
		);

		if (result.rows.length === 0) {
			console.log(RED + "[ERROR] User not found for SSN: " + SSN + RESET);
			return res.status(404).json({ msg: "User not found." });
		}

		console.log(
			GREEN +
				`[SUCCESS] User updated successfully. SSN: ` +
				JSON.parse(SSN) +
				RESET
		);
		res.json({ msg: "User updated successfully.", user: result.rows[0] });
	} catch (error) {
		console.error(
			RED + "[ERROR] Error updating user: " + error.message + RESET
		);
		res.status(500).send("Server error");
	}
};

// Delete User
const deleteUser = async (req, res) => {
	const { SSN } = req.params;

	try {
		console.log(YELLOW + `[INFO] Deleting user with SSN: ${SSN}` + RESET);
		const result = await db.query(
			"DELETE FROM USERS WHERE SSN = $1 RETURNING SSN",
			[SSN]
		);

		if (result.rows.length === 0) {
			console.log(RED + "[ERROR] User not found for SSN: " + SSN + RESET);
			return res.status(404).json({ msg: "User not found." });
		}

		console.log(
			GREEN + `[SUCCESS] User deleted successfully. SSN: ${SSN}` + RESET
		);
		res.json({ msg: "User deleted successfully." });
	} catch (error) {
		console.error(
			RED + "[ERROR] Error deleting user: " + error.message + RESET
		);
		res.status(500).send("Server error");
	}
};

module.exports = { getAllUsers, getUserBySSN, updateUser, deleteUser };
