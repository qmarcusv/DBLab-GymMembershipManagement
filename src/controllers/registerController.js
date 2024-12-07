const db = require("../../db/pg");

// Register a user for a membership
const registerForMembership = async (req, res) => {
	const { SSN, ProgramID, Method } = req.body;

	if (!SSN || !ProgramID || !Method) {
		return res
			.status(400)
			.json({ msg: "SSN, ProgramID, and Method are required." });
	}

	const validMethods = ["cash", "ebanking", "credit"];
	if (!validMethods.includes(Method)) {
		return res.status(400).json({ msg: "Invalid payment method." });
	}

	try {
		// Get Program details (price and duration)
		const getProgramQuery = "SELECT * FROM MEMBERSHIP WHERE ProgramID = $1";
		const programResult = await db.query(getProgramQuery, [ProgramID]);

		if (programResult.rows.length === 0) {
			return res.status(400).json({ msg: "Program not found." });
		}

		const program = programResult.rows[0];

		// Create invoice and register the user
		const startDate = new Date();
		const endDate = new Date(startDate);
		endDate.setMonth(endDate.getMonth() + 1); // Assuming 1-month duration

		const invoiceQuery = `
            INSERT INTO REGISTER (SSN, ProgramID, StartDate, EndDate, Method, PurchaseDate, Amount)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING Number`;
		const invoiceResult = await db.query(invoiceQuery, [
			SSN,
			ProgramID,
			startDate,
			endDate,
			Method,
			startDate,
			program.price,
		]);

		res.json({
			msg: `User with SSN ${SSN} successfully registered.`,
			invoiceNumber: invoiceResult.rows[0].Number,
		});
	} catch (error) {
		console.error("Error in registering user:", error);
		res.status(500).send("Server error");
	}
};

module.exports = { registerForMembership };
