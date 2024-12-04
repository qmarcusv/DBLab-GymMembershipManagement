const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../db/pg"); // PostgreSQL database connection
// Registration controller
const register = async (req, res) => {
	const { SSN, FName, LName, PhoneNum, Password, DoB } = req.body;

	// Check if any required field is missing or null
	if (!SSN || !FName || !LName || !PhoneNum || !Password || !DoB) {
		return res.status(400).json({ msg: "All fields are required." });
	}

	// Validate input length
	if (FName.length > 50 || LName.length > 50) {
		return res.status(400).json({
			msg: "First Name and Last Name must be less than 50 characters.",
		});
	}
	if (PhoneNum.length > 15) {
		return res
			.status(400)
			.json({ msg: "Phone number must be less than 15 characters." });
	}
	if (Password.length > 255) {
		return res
			.status(400)
			.json({ msg: "Password must be less than 255 characters." });
	}

	try {
		// **Hash the password before storing it in the database**
		const hashedPassword = await bcrypt.hash(Password, 10);

		// **Insert the new user into the database, default role is 'member'**
		const insertUserQuery =
			"INSERT INTO USERS (SSN, FName, LName, PhoneNum, Password, DoB, role) VALUES ($1, $2, $3, $4, $5, $6, 'member') RETURNING SSN, PhoneNum, role";
		const result = await db.query(insertUserQuery, [
			SSN,
			FName,
			LName,
			PhoneNum,
			hashedPassword,
			DoB,
		]);

		// **Generate a JWT token for the newly registered user, including the role**
		const token = jwt.sign(
			{ userId: result.rows[0].SSN, role: result.rows[0].role },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);
		// Log the SSN and Phone Number of the user after successful registration
		console.log(
			`>> User registered successfully. \nSSN: ${SSN} PhoneNum: ${PhoneNum}`
		);

		res.json({
			msg: "Registration successful!",
			token: token,
		});
	} catch (error) {
		console.error("Registration error", error);

		// Check for unique constraint violations on SSN and PhoneNum
		if (error.code === "23505") {
			// 23505 is the error code for unique violation in PostgreSQL
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

	// Check if any required field is missing or null
	if (!PhoneNum || !Password) {
		return res
			.status(400)
			.json({ msg: "Phone number and Password are required." });
	}

	try {
		// Check if user exists by PhoneNum
		const checkUserQuery = "SELECT * FROM USERS WHERE PhoneNum = $1";
		const result = await db.query(checkUserQuery, [PhoneNum]);

		if (result.rows.length === 0) {
			return res.status(400).json({ msg: "User not found" });
		}

		const user = result.rows[0];

		// Compare the provided password with the stored hashed password
		const isMatch = await bcrypt.compare(Password, user.password);
		if (!isMatch) {
			return res.status(400).json({ msg: "Wrong password" });
		}

		// Generate JWT token after successful login, including role
		const token = jwt.sign(
			{ userId: user.SSN, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		// Log success to the server
		console.log(
			`>> User logged in successfully.\nPhoneNum: ${PhoneNum} Role: ${user.role}`
		);

		res.json({
			msg: "Login successful!",
			token: token,
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).send("Server error");
	}
};

// Middleware to verify role
const verifyRole = (requiredRole) => {
	return (req, res, next) => {
		const token = req.header("x-auth-token");

		if (!token) {
			return res.status(401).json({ msg: "No token, authorization denied" });
		}

		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = decoded;

			// Check if the user's role matches the required role
			if (req.user.role !== requiredRole && req.user.role !== "admin") {
				return res.status(403).json({ msg: "Permission denied" });
			}

			next();
		} catch (error) {
			console.error("Token verification error:", error);
			res.status(401).json({ msg: "Token is not valid" });
		}
	};
};

module.exports = { register, login, verifyRole };
