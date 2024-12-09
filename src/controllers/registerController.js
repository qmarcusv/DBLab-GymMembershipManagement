const db = require("../../db/pg");

// Colors for logging
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

// Function to check if SSN exists
const checkSSNExists = async (SSN) => {
	const query = "SELECT 1 FROM REGISTER WHERE SSN = $1";
	const result = await db.query(query, [SSN]);
	return result.rows.length > 0; // Returns true if SSN exists
};
// Function to register for a program as an existing member
const registerForMembership = async (req, res) => {
	const { SSN, ProgramID, Method, StartDate } = req.body;

	// Validate required fields
	if (!SSN || !ProgramID || !Method || !StartDate) {
		console.log(
			RED + "[ERROR] Missing SSN, ProgramID, Method, or StartDate." + RESET
		);
		return res
			.status(400)
			.json({ msg: "SSN, ProgramID, Method, and StartDate are required." });
	}

	const validMethods = ["cash", "ebanking", "credit"];
	if (!validMethods.includes(Method)) {
		console.log(RED + "[ERROR] Invalid payment method." + RESET);
		return res.status(400).json({ msg: "Invalid payment method." });
	}

	try {
		// Check if the SSN already exists in the REGISTER table
		const checkRegistrationQuery = `
			SELECT * FROM REGISTER WHERE SSN = $1
		`;
		const registrationResult = await db.query(checkRegistrationQuery, [SSN]);

		// If no registrations found, it means they haven't registered for any program yet
		if (registrationResult.rows.length === 0) {
			console.log(RED + "[ERROR] User is not a member." + RESET);
			return res
				.status(400)
				.json({ msg: "User is not a member or has no active registration." });
		}

		// Get Program details
		console.log(
			YELLOW +
				"[INFO] Fetching program details for ProgramID: " +
				ProgramID +
				RESET
		);
		const programQuery = "SELECT * FROM MEMBERSHIP WHERE ProgramID = $1";
		const programResult = await db.query(programQuery, [ProgramID]);

		if (programResult.rows.length === 0) {
			console.log(RED + "[ERROR] Program not found." + RESET);
			return res.status(400).json({ msg: "Program not found." });
		}

		const program = programResult.rows[0];

		// Insert a new registration for the existing member
		const endDate = new Date(StartDate);
		endDate.setMonth(endDate.getMonth() + 1); // Assuming 1-month program duration

		const invoiceQuery = `
			INSERT INTO REGISTER (SSN, ProgramID, StartDate, EndDate, Method, PurchaseDate, Amount)
			VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING Number
		`;
		const invoiceResult = await db.query(invoiceQuery, [
			SSN,
			ProgramID,
			StartDate,
			endDate,
			Method,
			new Date(), // Purchase Date is the current date
			program.price,
		]);

		console.log(
			GREEN +
				`[SUCCESS] User with SSN ${SSN} successfully registered for the new program.` +
				RESET
		);
		res.json({
			msg: `User with SSN ${SSN} successfully registered for the new program.`,
			invoiceNumber: invoiceResult.rows[0].Number,
		});
	} catch (error) {
		logError("Error registering for program", error);
		res.status(500).send("Server error");
	}
};

// Function to get all registrations for a specific SSN
const getAllRegistrationsForSSN = async (req, res) => {
	const { SSN } = req.params; // Assuming SSN is passed as a URL parameter

	// Validate SSN parameter
	if (!SSN) {
		console.log(RED + "[ERROR] Missing SSN parameter." + RESET);
		return res.status(400).json({ msg: "SSN is required." });
	}

	try {
		// Query to fetch all registrations for the given SSN
		console.log(
			YELLOW + `[INFO] Fetching all registrations for SSN: ${SSN}...` + RESET
		);
		const getAllQuery = "SELECT * FROM REGISTER WHERE SSN = $1";

		// Execute the query
		const result = await db.query(getAllQuery, [SSN]);

		// If no registrations found for this SSN
		if (result.rows.length === 0) {
			console.log(
				RED + `[ERROR] No registrations found for SSN: ${SSN}.` + RESET
			);
			return res
				.status(404)
				.json({ msg: `No registrations found for SSN: ${SSN}.` });
		}

		// If registrations found, send them as a response
		console.log(
			GREEN +
				`[SUCCESS] Registrations for SSN ${SSN} fetched successfully.` +
				RESET
		);
		res.json({
			msg: `Registrations for SSN ${SSN} fetched successfully.`,
			registrations: result.rows,
		});
	} catch (error) {
		console.error(
			RED +
				`[ERROR] Error fetching registrations for SSN ${SSN}: ` +
				error.message +
				RESET
		);
		res.status(500).send("Server error");
	}
};

module.exports = { registerForMembership, getAllRegistrationsForSSN };
