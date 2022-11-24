import pool from "../db.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { addOtp, addUser, checkEmail, logincheckmail } from "../queries/userQueries.js";
import { createError } from "../utilis/error.js";


//signup
export const signupSerive = async (email, password, res, next) => {
  // const exisitngUser = await pool.query(checkEmail, [email]);
  // if (exisitngUser.rows.length) {
  //   return next(createError(409, "Email alredy exists"));
  // }
const hashedpassword = await bcryptjs.hash(password, 10);
      pool.query(addUser, [email, hashedpassword],(error)=>{
        if(error){
          return next(createError(400,error.detail))
        }else {
            
      return sendVerificationEmail(email, res, next);
        }
      })
    
    
  
 
};


export const sendVerificationEmail = async (email, res, next) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    //RandomGenreated otp sent to Your Mail
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email, //email from req body
      subject: "OTP VERIFICATION!!",
      text: "Use the below OTP for verification",
      html: `<p>use This <u><b>${otp}</b></u>otp to verify. Expire in 1 Hour </p>`,
    };

    const saltRound = 10;

    const hashedOTP = await bcryptjs.hash(otp, saltRound);
    let createdAt = Date.now();
    let expiresAt = Date.now() + 3600000;

    pool.query(addOtp, [email, hashedOTP, createdAt, expiresAt],(error)=>{
      if(error){
        return next(createError(400,error.detail));
      }
    });

    transport.sendMail(mailOptions);
    res.status(201).json({
      sucess: true,
      message: "verification otp sent to Email...",
    });
  } catch (err) {
    next(err);
  }
};

//login
export const loginService= async(email,password,res,next)=>{
  try {
    const exisitngUser = await pool.query(logincheckmail, [email]);
     console.log(exisitngUser);
    if (!exisitngUser.rows.length) {
    
      return next(createError(404, "User not found"));
    }
    const matchedPassword = await bcryptjs.compare(
      password,
      exisitngUser.rows[0].password
    );
    if (!matchedPassword) {
      return next(createError(400, "Invalid Credentials!!"));
    }

    const token = jwt.sign(
      { email: exisitngUser.rows[0].email, id: exisitngUser.rows[0].id },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    res
      .cookie("token", token, { httpOnly: true })
      .status(201)
      .json({ sucess: true, message: "Successfully LoggedIn" });
  } catch (err) {
    next(err);
  }

}
