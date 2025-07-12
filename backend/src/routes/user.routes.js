import { registerUser,login, updateProfile, forgetPassword, verifyOtp, createSwapRequest, me, getAllUser, deleteAlluser, getAllUserNotLogin, allsendRequest,allReciveRequest,acceptSwapRequst,rejectSwapRequest,getUserDetail} from "../controllers/user/user.controller.js";
import express from "express";
import {isAuthenticated} from "../middlewares/auth.middlewares.js"

const router  = express.Router();

router.route('/registration').post(registerUser);
router.route('/login').post(login);
router.route('/update').put(isAuthenticated,updateProfile);
router.route('/forgetpassword').post(isAuthenticated,forgetPassword);
router.route('/verifyotp').post(verifyOtp)
router.route('/sendswaprequest').post(isAuthenticated,createSwapRequest)
router.route('/me').get(isAuthenticated,me)
router.route('/getalluser').get(isAuthenticated,getAllUser);
router.route('/deletealluser').delete(deleteAlluser),
router.route('/getalluser-notlogin').get(getAllUserNotLogin)
router.route('/allsendrequest').get(isAuthenticated,allsendRequest)
router.route('/allreciverequest').get(isAuthenticated,allReciveRequest)
router.route('/accept/:id').post(isAuthenticated,acceptSwapRequst)
router.route('/reject/:id').post(isAuthenticated,rejectSwapRequest)
router.route('/detail').post(isAuthenticated,getUserDetail)
// router.route('/updateforgetpassword').post()


export const user_router = router;