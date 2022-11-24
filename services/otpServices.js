import bcryptjs from "bcryptjs";
import pool from "../db.js";
import { checkEmail, checkEmailforOtp, deleteOtp, updatedUser, updateUser } from "../queries/userQueries.js";
import { createError } from "../utilis/error.js";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "./userServices.js";

export const otpVerifyService =async(email,otp,res,next)=>{

    try {
        if (!email || !otp) {
          return next(createError(400, "Enter OTP or email"));
        } else {
          const userFind = await pool.query(checkEmailforOtp, [email]);
    
          // console.log(userFind)
    
          const { expiresat } = userFind.rows[0];
          const hashedotp = userFind.rows[0].otp;
    
          if (expiresat < Date.now()) {
            await pool.query(deleteOtp, [email]);
            return next(createError(400, "OTP expried. Request for New Otp..."));
          } else {
            const validOtp = await bcryptjs.compare(otp, hashedotp);
    
            if (!validOtp) {
              return next(createError(400, "Invalid OTP"));
            } else {
              await pool.query(updateUser, [email]);
    
              const verifiedUser = await pool.query(updatedUser, [email]);
              //   console.log(verifiedUser.rows[0]);
              await pool.query(deleteOtp, [email]);
              //   res.json({message:"verified"})
    
              const token = jwt.sign(verifiedUser.rows[0], process.env.SECRET_KEY, {
                expiresIn: "1h",
              });
              res.status(201).cookie("token", token, { httpOnly: true }).json({
                sucess: true,
                message: "Your Email Verified Successfully!!",
              });
            }
          }
        }
      } catch (err) {
        next(err);
      }


}

//resendotp
export const resendOtpService=async(email,res,next)=>{
  try {
        if (!email) {
          return next(createError(400, "Enter Email..."));
        } else {
          const exisitngUser = await pool.query(checkEmail, [email]);
    
          if (!exisitngUser.rows.length)
            return next(createError(404, "User not found!!"));
    
          await pool.query(deleteOtp, [email]);
          sendVerificationEmail(email, res, next);
        }
        res.status(201).json({ sucess: true, message: "OTP resent to Email..." });
      } catch (err) {
        next(err);
      }

}