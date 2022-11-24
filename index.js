import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRouter from './routes/userRoutes.js';
import cors from 'cors';
import productRouter  from './routes/productsRoutes.js';
import { homeRouter } from './routes/homeRouter.js';



const app= express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());
dotenv.config();
app.use(cors({
  origin: ["http://192.168.1.19:3000","http://localhost:3000"]
  
}))

//routes
app.use('/api',homeRouter);
app.use('/api/users',userRouter);
app.use('/api/products',productRouter);

//error handling
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
      success: false,
      message: errorMessage,
    });
  });



const port = process.env.PORT || 5002;
app.listen(port,()=>{
    console.log(`Server is Runnning on Port ${port}`)
})