const { Pool } = require("pg");
require("dotenv").config();

// Create a Pool to manage multiple simultaneous connections
const database = new Pool({
	host: process.env.PG_HOST, // PostgreSQL host
	port: process.env.PG_PORT, // PostgreSQL port
	database: process.env.PG_DATABASE,
	user: process.env.PG_USER,
	password: process.env.PG_PASSWORD,
	max: 10, // Optional: max number of connections in the pool
	ssl: process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : false, // Enable SSL for production
});

// Test the connection to the database
database
	.connect()
	.then((client) => {
		console.log(
			`PostgreSQL Database connected: ${process.env.PG_DATABASE} on ${process.env.PG_HOST}`
		);
		client.release(); // Release the client back to the pool
	})
	.catch((err) => {
		console.error(
			`Database connection error to ${process.env.PG_HOST}:`,
			err.stack
		);
	});

// Graceful shutdown
process.on("SIGINT", async () => {
	try {
		await database.end();
		console.log("Database pool has ended");
		process.exit(0);
	} catch (err) {
		console.error("Error shutting down database pool:", err.stack);
		process.exit(1);
	}
});

module.exports = database;
