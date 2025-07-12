import { registerUser,login, updateProfile, forgetPassword, verifyOtp } from "../controllers/user/user.controller.js";
import express from "express";

const router  = express.Router();

router.route('/registration').post(registerUser);
router.route('/login').post(login);
router.route('/update').patch(updateProfile);
router.route('/forgetpassword').post(forgetPassword);
router.route('/verifyotp').post(verifyOtp)
// router.route('/updateforgetpassword').post()


