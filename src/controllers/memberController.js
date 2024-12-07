const db = require("../../db/pg");

// Become a member
const becomeMember = async (req, res) => {
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

		// Insert into MEMBER table
		const joinDate = new Date();
		const insertMemberQuery = `
      INSERT INTO MEMBER (SSN, JoinDate)
      VALUES ($1, $2) RETURNING MemberID`;
		const result = await db.query(insertMemberQuery, [SSN, joinDate]);

		const newMember = result.rows[0];

		// Create Invoice for Registration
		const startDate = new Date();
		const endDate = new Date(startDate);
		endDate.setMonth(endDate.getMonth() + 1);

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
			msg: `User with SSN ${SSN} is now a member.`,
			memberID: newMember.MemberID,
			invoiceNumber: invoiceResult.rows[0].Number,
		});
	} catch (error) {
		console.error("Error in becoming member:", error);
		res.status(500).send("Server error");
	}
};

// Get all members
const getAllMembers = async (req, res) => {
	try {
		const result = await db.query("SELECT * FROM MEMBER");
		res.json(result.rows);
	} catch (error) {
		console.error("Error fetching members:", error);
		res.status(500).send("Server error");
	}
};

// Get a specific member by ID
const getMemberByID = async (req, res) => {
	const { memberID } = req.params;

	try {
		const result = await db.query("SELECT * FROM MEMBER WHERE MemberID = $1", [
			memberID,
		]);
		if (result.rows.length === 0) {
			return res.status(404).json({ msg: "Member not found." });
		}
		res.json(result.rows[0]);
	} catch (error) {
		console.error("Error fetching member:", error);
		res.status(500).send("Server error");
	}
};

// Update member information
const updateMember = async (req, res) => {
	const { memberID } = req.params;
	const { ProgramID, Method } = req.body;

	try {
		const updateMemberQuery = `
            UPDATE MEMBER SET ProgramID = $1 WHERE MemberID = $2 RETURNING MemberID`;
		const result = await db.query(updateMemberQuery, [ProgramID, memberID]);

		if (result.rows.length === 0) {
			return res.status(404).json({ msg: "Member not found." });
		}

		res.json({ msg: `Member with ID ${memberID} updated successfully.` });
	} catch (error) {
		console.error("Error updating member:", error);
		res.status(500).send("Server error");
	}
};

// Delete member
const deleteMember = async (req, res) => {
	const { memberID } = req.params;

	try {
		const result = await db.query(
			"DELETE FROM MEMBER WHERE MemberID = $1 RETURNING MemberID",
			[memberID]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ msg: "Member not found." });
		}

		res.json({ msg: `Member with ID ${memberID} deleted successfully.` });
	} catch (error) {
		console.error("Error deleting member:", error);
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
