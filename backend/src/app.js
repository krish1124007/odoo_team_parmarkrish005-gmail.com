import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { user_router } from "./routes/user.routes.js";

dotenv.config({});


const app = express();

//middlewares
app.use(cors({
    origin:"*"
}))
app.use(express.json());
app.use('/public' , express.static('public'))


app.use('/api/v1/user' , user_router)



export {app};