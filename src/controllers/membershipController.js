const db = require("../../db/pg");

// Colors for logging
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

// Get all memberships
const getAllMemberships = async (req, res) => {
	try {
		console.log(GREEN + "[INFO] Fetching all memberships..." + RESET); // Log action
		const result = await db.query("SELECT * FROM MEMBERSHIP");
		console.log(GREEN + "[SUCCESS] Retrieved all memberships." + RESET); // Success log
		res.json(result.rows);
	} catch (err) {
		console.log(
			RED + "[ERROR] Failed to fetch memberships: " + err.message + RESET
		); // Error log
		res.status(500).json({ msg: "Server error" });
	}
};

// Get membership by ID
const getMembershipById = async (req, res) => {
	const { id } = req.params;
	try {
		console.log(
			YELLOW + `[INFO] Fetching membership with ID: ${id}...` + RESET
		); // Log action
		const result = await db.query(
			"SELECT * FROM MEMBERSHIP WHERE ProgramID = $1",
			[id]
		);
		if (result.rows.length === 0) {
			console.log(YELLOW + `[INFO] Program with ID ${id} not found.` + RESET);
			return res.status(404).json({ msg: "Program not found." });
		}
		console.log(
			GREEN + `[SUCCESS] Retrieved membership with ID: ${id}.` + RESET
		); // Success log
		res.json(result.rows[0]);
	} catch (err) {
		console.log(
			RED +
				`[ERROR] Failed to fetch membership with ID ${id}: ` +
				err.message +
				RESET
		); // Error log
		res.status(500).json({ msg: "Server error" });
	}
};

// Create a new membership (add to table)
const createMembership = async (req, res) => {
	const { ProgramName, Price, Status } = req.body;
	if (!ProgramName || !Price || !Status) {
		console.log(
			YELLOW +
				"[INFO] Missing required fields in create membership request." +
				RESET
		); // Log action
		return res
			.status(400)
			.json({ msg: "ProgramName, Price, and Status are required." });
	}

	try {
		const query =
			"INSERT INTO MEMBERSHIP (ProgramName, Price, Status) VALUES ($1, $2, $3) RETURNING *";
		const result = await db.query(query, [ProgramName, Price, Status]);
		console.log(
			GREEN + `[SUCCESS] Membership "${ProgramName}" created.` + RESET
		); // Success log
		res.json({ msg: "Membership created.", membership: result.rows[0] });
	} catch (err) {
		console.log(
			RED + "[ERROR] Failed to create membership: " + err.message + RESET
		); // Error log
		res.status(500).json({ msg: "Server error" });
	}
};

// Delete a membership by ID
const deleteMembership = async (req, res) => {
	const { id } = req.params;
	try {
		console.log(
			YELLOW + `[INFO] Deleting membership with ID: ${id}...` + RESET
		); // Log action
		const result = await db.query(
			"DELETE FROM MEMBERSHIP WHERE ProgramID = $1 RETURNING *",
			[id]
		);
		if (result.rows.length === 0) {
			console.log(
				YELLOW + `[INFO] Program with ID ${id} not found for deletion.` + RESET
			); // Log not found case
			return res.status(404).json({ msg: "Program not found." });
		}
		console.log(GREEN + `[SUCCESS] Membership with ID ${id} deleted.` + RESET); // Success log
		res.json({ msg: "Membership deleted." });
	} catch (err) {
		console.log(
			RED +
				`[ERROR] Failed to delete membership with ID ${id}: ` +
				err.message +
				RESET
		); // Error log
		res.status(500).json({ msg: "Server error" });
	}
};

// Register for a membership
const registerMembership = async (req, res) => {
	const { SSN, ProgramID, Method } = req.body;
	if (!SSN || !ProgramID || !Method) {
		console.log(
			YELLOW +
				"[INFO] Missing required fields in register membership request." +
				RESET
		); // Log action
		return res
			.status(400)
			.json({ msg: "SSN, ProgramID, and Method are required." });
	}

	try {
		// Get Program details
		const query = "SELECT * FROM MEMBERSHIP WHERE ProgramID = $1";
		const result = await db.query(query, [ProgramID]);
		if (result.rows.length === 0) {
			console.log(
				YELLOW + `[INFO] Program with ID ${ProgramID} not found.` + RESET
			);
			return res.status(400).json({ msg: "Program not found." });
		}

		const program = result.rows[0];

		// Create Invoice (Demo only)
		const startDate = new Date();
		const endDate = new Date(startDate);
		endDate.setMonth(endDate.getMonth() + 1); // Example for 1 month duration

		const invoiceQuery = `
      INSERT INTO REGISTER (SSN, ProgramID, StartDate, EndDate, Method, PurchaseDate, Amount)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING Number
    `;
		const invoiceResult = await db.query(invoiceQuery, [
			SSN,
			ProgramID,
			startDate,
			endDate,
			Method,
			startDate,
			program.Price,
		]);

		console.log(
			GREEN +
				`[SUCCESS] Membership purchased. Invoice #${invoiceResult.rows[0].Number}` +
				RESET
		); // Success log
		res.json({
			msg: `Membership purchased. Invoice #${invoiceResult.rows[0].Number}`,
		});
	} catch (err) {
		console.log(
			RED + `[ERROR] Failed to register membership: ` + err.message + RESET
		); // Error log
		res.status(500).json({ msg: "Server error" });
	}
};

module.exports = {
	getAllMemberships,
	getMembershipById,
	createMembership,
	deleteMembership,
	registerMembership,
};
