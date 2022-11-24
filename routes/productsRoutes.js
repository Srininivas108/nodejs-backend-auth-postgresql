import express from 'express';
import {auth} from '../middleware/auth.js'
 

const productRouter = express.Router();

productRouter.get('/',auth,(req,res)=>{
    res.send("authorized")
})

export default productRouter;