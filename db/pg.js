// Get the client
const { Pool } = require("pg");

// Create a Pool to manage multiple simultaneous connections
const database = new Pool({
	host: process.env.PG_HOST, // PostgreSQL host
	port: process.env.PG_PORT, // PostgreSQL port
	database: process.env.PG_DATABASE,
	user: process.env.PG_USER,
	password: process.env.PG_PASSWORD,
	max: 10, // Optional: max number of connections in the pool
});

// Connect to DB
database
	.connect()
	.then((client) => {
		console.log("PostgreSQL Database connected:", process.env.PG_DATABASE);
		client.release(); // Release the client back to the pool
	})
	.catch((err) => {
		console.error("Connection error:", err.stack);
	});

module.exports = database;
