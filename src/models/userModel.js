// userModel.js
const db = require("../../db/pg"); // PostgreSQL database connection

// Update role of the user in the database
const updateRole = async (SSN, newRole) => {
	const updateRoleQuery =
		"UPDATE USERS SET role = $1 WHERE SSN = $2 RETURNING SSN, role";
	const result = await db.query(updateRoleQuery, [newRole, SSN]);
	return result.rows[0];
};

module.exports = { updateRole };
