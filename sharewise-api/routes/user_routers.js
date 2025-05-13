const {Router} = require ("express")
const userController = require("../controllers/user_controllers")
const userRouter = Router()

userRouter.post("/donorsignup", userController.signup);
userRouter.post("/schoolsignup", userController.signup);
userRouter.post("/login", userController.login);

module.exports = userRouter;