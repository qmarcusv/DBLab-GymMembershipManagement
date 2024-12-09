const db = require("../../db/pg");

// Colors for logging
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

// Helper function for logging errors
const logError = (message, error) => {
	console.error(RED + `[ERROR] ${message}: ${error.message || error}` + RESET);
};

// Function to become a member
const becomeMember = async (req, res) => {
	const { SSN, ProgramID, Method, TrainerID } = req.body;

	console.log(YELLOW + "[INFO] Starting member registration process." + RESET);

	// Validate required fields
	if (!SSN || !ProgramID || !Method) {
		console.log(
			RED + "[ERROR] Missing required fields for registration." + RESET
		);
		return res
			.status(400)
			.json({ msg: "SSN, ProgramID, and Method are required." });
	}

	const validMethods = ["cash", "ebanking", "credit"];
	if (!validMethods.includes(Method)) {
		console.log(RED + "[ERROR] Invalid payment method provided." + RESET);
		return res.status(400).json({ msg: "Invalid payment method." });
	}

	try {
		// Check if SSN is already a member
		const checkMemberQuery = "SELECT * FROM MEMBER WHERE SSN = $1";
		const memberCheckResult = await db.query(checkMemberQuery, [SSN]);

		if (memberCheckResult.rows.length > 0) {
			console.log(GREEN + "[INFO] Member with SSN already exists." + RESET);
			return res.status(400).json({ msg: "User is already a member." });
		}

		// Get Program details
		console.log(YELLOW + "[INFO] Fetching program details." + RESET);
		const programQuery = "SELECT * FROM MEMBERSHIP WHERE ProgramID = $1";
		const programResult = await db.query(programQuery, [ProgramID]);

		if (programResult.rows.length === 0) {
			console.log(RED + "[ERROR] Program not found." + RESET);
			return res.status(400).json({ msg: "Program not found." });
		}

		const program = programResult.rows[0];

		// Check if TrainerID is provided
		let insertMemberQuery;
		let values;

		if (TrainerID) {
			// If TrainerID is provided, include it in the query
			insertMemberQuery = `
                INSERT INTO MEMBER (SSN, JoinDate, TrainerID)
                VALUES ($1, $2, $3) RETURNING MemberID
            `;
			values = [SSN, new Date(), TrainerID];
		} else {
			// If TrainerID is not provided, omit it from the query
			insertMemberQuery = `
                INSERT INTO MEMBER (SSN, JoinDate)
                VALUES ($1, $2) RETURNING MemberID
            `;
			values = [SSN, new Date()];
		}

		// Insert into MEMBER table to make the user a member
		const memberResult = await db.query(insertMemberQuery, values);

		// Create Invoice for registration
		const startDate = new Date();
		const endDate = new Date(startDate);
		endDate.setMonth(endDate.getMonth() + 1); // Assuming 1-month program duration

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
			program.price,
		]);

		console.log(GREEN + `[SUCCESS] Member registration completed.` + RESET);
		res.json({
			msg: `User with SSN ${SSN} is now a member.`,
			memberID: memberResult.rows[0].MemberID,
			invoiceNumber: invoiceResult.rows[0].Number,
		});
	} catch (error) {
		logError("Error in becoming a member", error);
		res.status(500).send("Server error");
	}
};

// Get all members
const getAllMembers = async (req, res) => {
	try {
		console.log(YELLOW + "[INFO] Fetching all members." + RESET);
		const result = await db.query("SELECT * FROM MEMBER");
		console.log(GREEN + "[SUCCESS] Retrieved all members." + RESET);
		res.json(result.rows);
	} catch (error) {
		logError("Error fetching all members", error);
		res.status(500).send("Server error");
	}
};

// Get a specific member by ID
const getMemberByID = async (req, res) => {
	const { memberID } = req.params;

	try {
		console.log(
			YELLOW + `[INFO] Fetching member details for ID: ${memberID}` + RESET
		);
		const result = await db.query("SELECT * FROM MEMBER WHERE MemberID = $1", [
			memberID,
		]);
		if (result.rows.length === 0) {
			console.log(
				YELLOW + `[INFO] Member not found with ID: ${memberID}` + RESET
			);
			return res.status(404).json({ msg: "Member not found." });
		}
		console.log(
			GREEN + `[SUCCESS] Retrieved member details for ID: ${memberID}` + RESET
		);
		res.json(result.rows[0]);
	} catch (error) {
		logError("Error fetching member by ID", error);
		res.status(500).send("Server error");
	}
};

// Update member information
const updateMember = async (req, res) => {
	const { memberID } = req.params;
	const { ProgramID, Method } = req.body;

	console.log(YELLOW + `[INFO] Updating member with ID: ${memberID}` + RESET);

	if (!ProgramID || !Method) {
		console.log(
			RED + "[ERROR] Missing ProgramID or Method in update request." + RESET
		);
		return res.status(400).json({ msg: "ProgramID and Method are required." });
	}

	const validMethods = ["cash", "ebanking", "credit"];
	if (!validMethods.includes(Method)) {
		console.log(
			RED + "[ERROR] Invalid payment method provided in update request." + RESET
		);
		return res.status(400).json({ msg: "Invalid payment method." });
	}

	try {
		const updateMemberQuery = `
      UPDATE MEMBER SET ProgramID = $1 WHERE MemberID = $2 RETURNING MemberID`;
		const result = await db.query(updateMemberQuery, [ProgramID, memberID]);

		if (result.rows.length === 0) {
			console.log(
				YELLOW + `[INFO] Member not found with ID: ${memberID}` + RESET
			);
			return res.status(404).json({ msg: "Member not found." });
		}

		console.log(
			GREEN + `[SUCCESS] Member with ID ${memberID} updated.` + RESET
		);
		res.json({ msg: `Member with ID ${memberID} updated successfully.` });
	} catch (error) {
		logError("Error updating member", error);
		res.status(500).send("Server error");
	}
};

// Delete member
const deleteMember = async (req, res) => {
	const { memberID } = req.params;

	console.log(YELLOW + `[INFO] Deleting member with ID: ${memberID}` + RESET);

	try {
		const result = await db.query(
			"DELETE FROM MEMBER WHERE MemberID = $1 RETURNING MemberID",
			[memberID]
		);

		if (result.rows.length === 0) {
			console.log(
				YELLOW + `[INFO] Member not found with ID: ${memberID}` + RESET
			);
			return res.status(404).json({ msg: "Member not found." });
		}

		console.log(
			GREEN + `[SUCCESS] Member with ID ${memberID} deleted.` + RESET
		);
		res.json({ msg: `Member with ID ${memberID} deleted successfully.` });
	} catch (error) {
		logError("Error deleting member", error);
		res.status(500).send("Server error");
	}
};

module.exports = {
	becomeMember,
	getAllMembers,
	getMemberByID,
	updateMember,
	deleteMember,
};
