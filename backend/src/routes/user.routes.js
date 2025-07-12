import { registerUser,login, updateProfile, forgetPassword, verifyOtp, createSwapRequest } from "../controllers/user/user.controller.js";
import express from "express";
import {isAuthenticated} from "../middlewares/auth.middlewares.js"

const router  = express.Router();

router.route('/registration').post(registerUser);
router.route('/login').post(login);
router.route('/update').patch(isAuthenticated,updateProfile);
router.route('/forgetpassword').post(isAuthenticated,forgetPassword);
router.route('/verifyotp').post(verifyOtp)
router.route('/sendswaprequest').post(isAuthenticated,createSwapRequest)
// router.route('/updateforgetpassword').post()


export const user_router = router;