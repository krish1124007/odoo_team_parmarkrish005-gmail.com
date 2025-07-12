import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { user_router } from "./routes/user.routes.js";
import callRoutes from "./routes/call.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config({});


const app = express();

//middlewares
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}))
app.use(express.json());
app.use('/public' , express.static('public'))


app.use('/api/v1/user' , user_router)
app.use("/api/v1/call", callRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/admin", adminRoutes);



export {app};