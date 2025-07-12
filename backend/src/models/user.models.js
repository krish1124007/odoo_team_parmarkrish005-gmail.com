import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: false
    },
    profile_photo: {
        type: String,
        required: false,
        default:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740"
    },
    location: {
        type: String,
        required: false
    },
    availability: {
        type: [String],
        enum: ["Weekdays", "Evenings", "Weekends", "Anytime"],
        default: ["Weekends"]
    },
    public_profile: {
        type: Boolean,
        default: true
    },
    skills_offered: {
        type: [String],
        required: true,
        validate: [(val) => val.length > 0, 'At least one offered skill is required']
    },
    skills_wanted: {
        type: [String],
        required: true,
        validate: [(val) => val.length > 0, 'At least one wanted skill is required']
    },
    github_profile: {
        type: String,
        required: true
    }
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
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
});

UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id: this._id, role: this.role },
        process.env.JWT_SECRATE,
        { expiresIn: process.env.EXPIRES_IN }
    );
};

export const User = mongoose.model("User", UserSchema);
