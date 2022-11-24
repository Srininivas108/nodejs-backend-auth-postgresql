import express from 'express';
import { forgotpassword, login, loginValidate, resendOTPVerification, signup, verifyOtp, verifyTokentoResetPassword } from '../controllers/userController.js';
import { registerValidate } from '../controllers/userController.js';
import morgan from 'morgan';

const userRouter = express.Router();

userRouter.post("/signup",registerValidate,signup);
userRouter.post("/verifyOtp",verifyOtp);
userRouter.post("/resendOtp",resendOTPVerification);
userRouter.put("/login",morgan('combined'),loginValidate,login);
userRouter.post("/forgotpassword",forgotpassword);
userRouter.put('/resetpassword',verifyTokentoResetPassword)



export default userRouter;


