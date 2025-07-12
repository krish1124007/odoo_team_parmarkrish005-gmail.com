import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true
    }

}, { timestamps: true })


AdminSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
})


AdminSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

AdminSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.JWT_SECRATE,
        { expiresIn: process.env.EXPIRES_IN }
    )
}


export const Admin = mongoose.model("Admin", AdminSchema);