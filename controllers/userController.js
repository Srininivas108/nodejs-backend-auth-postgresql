import {check,validationResult} from 'express-validator';
import {loginService, signupSerive } from "../services/userServices.js";
import { otpVerifyService, resendOtpService } from "../services/otpServices.js";
import { forgotpass, resetPass } from '../services/forgotpasswordServices.js';



// Validation Array
export let registerValidate = [
  // Check email
  check('email', 'Must Be an Email Address').isEmail()
  .trim().escape().normalizeEmail(),
  // Check Password
  check('password').isLength({ min: 8 }).withMessage('Password Must Be at Least 8 Characters').matches('[0-9]').withMessage('Password Must Contain a Number').matches('[A-Z]').withMessage('Password Must Contain an Uppercase Letter').trim().escape()];


//SignUp
export const signup = (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  	return res.status(422).json({ errors: errors.array().map(e=>e.msg) });
  }else{
   const { email, password } = req.body;
  return signupSerive(email, password, res, next);
  }
  
};

//VerifyOTP
export const verifyOtp =  (req, res, next) => {
  const { email, otp } = req.body;

  return otpVerifyService(email,otp,res,next);
};

//resendOTP
export const resendOTPVerification = (req, res, next) => {
  const { email } = req.body;
    return resendOtpService(email,res,next);
};

//login


export let loginValidate = [
  // Check email
  check('email', 'Must Be an Email Address').isEmail()
  .trim().escape().normalizeEmail()]


export const login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  	return res.status(422).json({ errors: errors.array().map(e=>e.msg) });
  }else{
  const { email, password } = req.body;
  
  return loginService(email,password,res,next);
  }
};



//forgotpassword

//ForgetPassword
export const forgotpassword = async (req, res,next) => {
  const {email} = req.body;
  return forgotpass(email,res,next);
 
};



export const verifyTokentoResetPassword=async(req,res,next)=>{
   const {email,password,token}= req.body;
    return resetPass(email,password,token,res,next);
}

