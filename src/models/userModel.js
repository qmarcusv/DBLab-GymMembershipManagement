const { DataTypes } = require("sequelize");
const db = require("../db/pg"); // Assuming this is your Sequelize instance

const User = db.define(
	"User",
	{
		SSN: {
			type: DataTypes.CHAR(12),
			primaryKey: true,
			allowNull: false,
		},
		FName: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		LName: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		PhoneNum: {
			type: DataTypes.STRING(12),
			allowNull: false,
			unique: true,
		},
		Password: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		DoB: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		tableName: "USERS",
		timestamps: false, // Assuming the table does not have timestamps like createdAt/updatedAt
	}
);

module.exports = User;
