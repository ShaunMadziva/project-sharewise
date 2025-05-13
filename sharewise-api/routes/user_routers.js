const {Router} = require ("express")
const userController = require("../controllers/user_controllers")
const userRouter = Router()

userRouter.post("/donorsignup", userController.donorSignup);
userRouter.post("/schoolsignup", userController.schoolSignup);
userRouter.post("/login", userController.login);

module.exports = userRouter;