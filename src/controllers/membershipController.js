const db = require("../../db/pg");

// Get all memberships
const getAllMemberships = async (req, res) => {
	try {
		const result = await db.query("SELECT * FROM MEMBERSHIP");
		res.json(result.rows);
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: "Server error" });
	}
};

// Get membership by ID
const getMembershipById = async (req, res) => {
	const { id } = req.params;
	try {
		const result = await db.query(
			"SELECT * FROM MEMBERSHIP WHERE ProgramID = $1",
			[id]
		);
		if (result.rows.length === 0) {
			return res.status(404).json({ msg: "Program not found." });
		}
		res.json(result.rows[0]);
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: "Server error" });
	}
};

// Create a new membership (add to table)
const createMembership = async (req, res) => {
	const { ProgramName, Price, Status } = req.body;
	if (!ProgramName || !Price || !Status) {
		return res
			.status(400)
			.json({ msg: "ProgramName, Price, and Status are required." });
	}

	try {
		const query =
			"INSERT INTO MEMBERSHIP (ProgramName, Price, Status) VALUES ($1, $2, $3) RETURNING *";
		const result = await db.query(query, [ProgramName, Price, Status]);
		res.json({ msg: "Membership created.", membership: result.rows[0] });
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: "Server error" });
	}
};

// Delete a membership by ID
const deleteMembership = async (req, res) => {
	const { id } = req.params;
	try {
		const result = await db.query(
			"DELETE FROM MEMBERSHIP WHERE ProgramID = $1 RETURNING *",
			[id]
		);
		if (result.rows.length === 0) {
			return res.status(404).json({ msg: "Program not found." });
		}
		res.json({ msg: "Membership deleted." });
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: "Server error" });
	}
};

// Register for a membership
const registerMembership = async (req, res) => {
	const { SSN, ProgramID, Method } = req.body;
	if (!SSN || !ProgramID || !Method) {
		return res
			.status(400)
			.json({ msg: "SSN, ProgramID, and Method are required." });
	}

	try {
		// Get Program details
		const query = "SELECT * FROM MEMBERSHIP WHERE ProgramID = $1";
		const result = await db.query(query, [ProgramID]);
		if (result.rows.length === 0) {
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

		res.json({
			msg: `Membership purchased. Invoice #${invoiceResult.rows[0].Number}`,
		});
	} catch (error) {
		console.error(error);
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
