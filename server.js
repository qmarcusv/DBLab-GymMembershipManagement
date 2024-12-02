// load .env file:
require("dotenv").config();
const PORT = process.env.NODE_APP_PORT || 3000;

const app = require("./src/app");
// console.log("Server.js: app", app);
// Listen for server events
app
	.listen(PORT, () => {
		console.log(`Server is listening port ${PORT} in ${process.env.NODE_ENV}`);
	})
	.on("error", (err) => {
		console.error("Error:", err.message);
	});
