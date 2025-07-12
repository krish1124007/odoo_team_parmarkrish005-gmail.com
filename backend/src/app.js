import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({});


const app = express();

//middlewares
app.use(cors({
    origin:"*"
}))
app.use(express.json());
app.use('/public' , express.static('public'))





export {app};