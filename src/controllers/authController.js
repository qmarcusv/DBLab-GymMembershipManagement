const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../db/pg"); // PostgreSQL database connection

// Colors for logging
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

// Registration controller
const register = async (req, res) => {
	const { SSN, FName, LName, PhoneNum, Password, DoB } = req.body;
	console.log(req.body);
	// Validate required fields

	if (!SSN || !FName || !LName || !PhoneNum || !Password) {
		console.log(
			RED + "[ERROR] Missing required fields for registration." + RESET
		);
		return res.status(400).json({ msg: "All fields are required." });
	}

	try {
		console.log(YELLOW + "[INFO] Hashing password for secure storage." + RESET);
		const hashedPassword = await bcrypt.hash(Password, 10);
		// Insert the new user into the database
		console.log(
			YELLOW + "[INFO] Registering new user in the database." + RESET
		);
		const insertUserQuery =
			"INSERT INTO USERS (SSN, FName, LName, PhoneNum, Password, DoB) VALUES ($1, $2, $3, $4, $5, $6) RETURNING SSN, PhoneNum";
		const result = await db.query(insertUserQuery, [
			SSN,
			FName,
			LName,
			PhoneNum,
			hashedPassword,
			DoB,
		]);
		// Generate JWT token
		console.log(YELLOW + "[INFO] Generating JWT token for the user." + RESET);
		const token = jwt.sign(
			{ userId: result.rows[0].SSN },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		console.log(
			GREEN +
				`>> User registered successfully. SSN: ${SSN}, PhoneNum: ${PhoneNum}` +
				RESET
		);
		res.json({
			msg: "Registration successful!",
			token: token,
		});
	} catch (error) {
		console.error(RED + "[ERROR] Registration error: " + error.message + RESET);

		if (error.code === "23505") {
			console.log(RED + "[ERROR] SSN or Phone number already exists." + RESET);
			return res
				.status(400)
				.json({ msg: "SSN or Phone number already exists" });
		}

		res.status(500).send("Server error");
	}
};

// Login controller
const login = async (req, res) => {
	const { PhoneNum, Password } = req.body;
	console.log(req.body);
	// Validate required fields
	if (!PhoneNum || !Password) {
		console.log(
			RED + "[ERROR] Missing phone number or password for login." + RESET
		);
		return res
			.status(400)
			.json({ msg: "Phone number and Password are required." });
	}

	try {
		// Check if user exists
		console.log(
			YELLOW +
				`[INFO] Checking user existence for PhoneNum: ${PhoneNum}.` +
				RESET
		);
		const checkUserQuery = "SELECT * FROM USERS WHERE PhoneNum = $1";
		const result = await db.query(checkUserQuery, [PhoneNum]);

		if (result.rows.length === 0) {
			console.log(
				RED + "[ERROR] User not found for PhoneNum: " + PhoneNum + RESET
			);
			return res.status(400).json({ msg: "User not found" });
		}

		const user = result.rows[0];

		// Compare passwords
		console.log(YELLOW + "[INFO] Verifying user password." + RESET);
		const isMatch = await bcrypt.compare(Password, user.password);
		if (!isMatch) {
			console.log(
				RED + "[ERROR] Incorrect password for PhoneNum: " + PhoneNum + RESET
			);
			return res.status(400).json({ msg: "Wrong password" });
		}

		// Generate JWT token
		console.log(YELLOW + "[INFO] Generating JWT token for login." + RESET);
		const token = jwt.sign({ userId: user.ssn }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		console.log(
			GREEN +
				`>> User logged in successfully. PhoneNum: ${PhoneNum}, SSN: ${user.ssn}` +
				RESET
		);
		res.json({
			msg: "Login successful!",
			token: token,
		});
	} catch (error) {
		console.error(RED + "[ERROR] Login error: " + error.message + RESET);
		res.status(500).send("Server error");
	}
};

module.exports = { register, login };
