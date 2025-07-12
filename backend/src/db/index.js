import mongoose from "mongoose";


async function connectDB()
{
    try {
        const response  = await mongoose.connect(DB_URL);
        console.log("Database connect succuessfully")
    } catch (error) {
        console.log("something error generated while the update the database")
    }
}