class UserController {
	async findAll(req, res, next) {
		console.log("userController.findAll");
		res.send("userController.findAll work");
	}
	async findById(req, res, next) {
		res.send("userController.findByUuid work");
	}
	async create(req, res, next) {}
	async update(req, res, next) {}
	async delete(req, res, next) {}
}

// export & Instantiate
module.exports = new UserController();
