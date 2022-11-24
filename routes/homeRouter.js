import express from 'express';

export const homeRouter= express.Router();

homeRouter.get('/home',(req,res,next)=>{
    res.send("Home Page Here")
})
