import nodemailer from 'nodemailer';
import jwt from "jsonwebtoken";
import bcryptjs from 'bcryptjs';
import pool from '../db.js';
import { createError } from '../utilis/error.js';
import { checktoken, deleteToken, insertToken, logincheckmail, updatedUser, updateUserpassword } from '../queries/userQueries.js';

export const forgotpass=async(email,res,next)=>{

    try {
        const exisitngUser = await pool.query(logincheckmail, [email]);
        // console.log(exisitngUser)
       
        if (!exisitngUser.rows.length) {
        
          return next(createError(404, "User not found"));
        }
        //generate random password
        let chars =
          "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let gtokenLength = 5;
        let gtoken = "";
        for (let i = 0; i <= gtokenLength; i++) {
          let randomNumber = Math.floor(Math.random() * chars.length);
          gtoken += chars.substring(randomNumber, randomNumber + 1);
        }
        const newgtoken = await bcryptjs.hash(gtoken, 10);
    
         await pool.query(insertToken,[email,newgtoken])
                               
    
        //RandomGenreated Password sent to Your Mail
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
          subject: "RESET PASSWORD!!",
          text: "Use below New token to reset Password",
          html: `<p>use This <u><b>${gtoken}</b></u> token to reset password</p>`,
        };
    
        transport.sendMail(mailOptions, (error) => {
          if (error) {
            console.log(error);
          } else {
            res.status(201).json({ success: true,message: 'Token sent to your mail' });
          }
        });
      } catch (error) {
        next(error);
      }

}


export const resetPass=async(email,password,token,res,next)=>{
    try {
        if (!email || !token) {
          return next(createError(400, "Enter token or email"));
        } else {
          const userFind = await pool.query(checktoken, [email]);
    
    
          const returnedEmail= userFind.rows[0].email;
          const hashedtoken = userFind.rows[0].token;
    
        
            const validtoken = await bcryptjs.compare(token, hashedtoken);
    
            if (!validtoken) {
              return next(createError(400, "Invalid token"));
            } else {
              const hashedpassword = await bcryptjs.hash(password, 10);
              await pool.query(updateUserpassword, [returnedEmail,hashedpassword]);
    
              const verifiedUser = await pool.query(updatedUser, [returnedEmail]);
              //   console.log(verifiedUser.rows[0]);
              await pool.query(deleteToken, [returnedEmail]);
              //   res.json({message:"verified"})
    
              const tokenn = jwt.sign(verifiedUser.rows[0], process.env.SECRET_KEY, {
                expiresIn: "1h",
              });
              res.status(201).cookie("token", tokenn, { httpOnly: true }).json({
                sucess: true,
                message: "Your Password Successfully Changed",
              });
            }
          }
        } catch (err) {
        next(err);
      }
    
}