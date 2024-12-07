const db = require("../../db/pg");
// Get all trainers
const getAllUsers = async (req, res) => {
	try {
		const result = await db.query("SELECT * FROM USERS");
		res.json(result.rows);
	} catch (error) {
		console.error("Error fetching trainers:", error);
		res.status(500).send("Server error");
	}
};
// Get User by SSN
const getUserBySSN = async (req, res) => {
	const { SSN } = req.params;

	try {
		const result = await db.query("SELECT * FROM USERS WHERE SSN = $1", [SSN]);

		if (result.rows.length === 0) {
			return res.status(404).json({ msg: "User not found." });
		}

		res.json({ user: result.rows[0] });
	} catch (error) {
		console.error("Error fetching user:", error);
		res.status(500).send("Server error");
	}
};

// Update User
const updateUser = async (req, res) => {
	const { SSN } = req.params;
	const { FName, LName, PhoneNum, DoB } = req.body;

	try {
		const result = await db.query(
			`UPDATE USERS SET FName = $1, LName = $2, PhoneNum = $3, DoB = $4 WHERE SSN = $5 RETURNING SSN`,
			[FName, LName, PhoneNum, DoB, SSN]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ msg: "User not found." });
		}

		res.json({ msg: "User updated successfully.", user: result.rows[0] });
	} catch (error) {
		console.error("Error updating user:", error);
		res.status(500).send("Server error");
	}
};

// Delete User
const deleteUser = async (req, res) => {
	const { SSN } = req.params;

	try {
		const result = await db.query(
			"DELETE FROM USERS WHERE SSN = $1 RETURNING SSN",
			[SSN]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ msg: "User not found." });
		}

		res.json({ msg: "User deleted successfully." });
	} catch (error) {
		console.error("Error deleting user:", error);
		res.status(500).send("Server error");
	}
};

module.exports = { getAllUsers, getUserBySSN, updateUser, deleteUser };
