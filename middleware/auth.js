import jwt from 'jsonwebtoken';
import { createError } from '../utilis/error.js';

export const auth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      return next(createError(401, "You are not authenticated!"));
    }
      jwt.verify(token, process.env.SECRET_KEY,(err,user)=>{
        if (err) 
        {
          res.clearCookie("token");
          return next(createError(403, "Token is not valid!"));
        }
        req.user = user;
        next();
      });
    
};

