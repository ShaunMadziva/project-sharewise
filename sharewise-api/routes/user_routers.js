const {Router} = require ("express")
const userController = require("../controllers/user_controllers")
const userRouter = Router()

userRouter.post("/donorsignup", userController.donorregister);
userRouter.post("/schoolsignup", userController.schoolregister);
userRouter.post("/schoollogin", userController.schoollogin);
userRouter.post("/donorlogin", userController.donorlogin);

module.exports = userRouter;