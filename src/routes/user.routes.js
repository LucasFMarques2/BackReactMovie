const { Router } = require("express");
const userRouter = Router();

const UsersControllers = require("../controllers/UsersControllers");

const userController = new UsersControllers();

userRouter.post("/", userController.create);
userRouter.put("/:id", userController.update);

module.exports = userRouter;
