import { User } from "../../models/user.models.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { sendMail } from "../../utils/sendMail.js";
import { generateOTP } from "../../utils/generateOtp.js"
import { Otp } from "../../models/otp.model.js";


const registerUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400)
            .json(
                new ApiResponse(400, "Please Enter email and password", { success: false, data: "DataNullError" })
            )
    }

    const isUserExist = await User.findOne({ email: email })
    if (isUserExist) {
        return res.status(400)
            .json(
                new ApiResponse(400, "user is already exist", { success: false, data: "ObjectAlreadyExistNull" })
            )
    }

    const createNewUser = await User.create({ email, password })

    if (!createNewUser) {
        return res.status(500)
            .json(
                new ApiResponse(500, "user is not created", { success: false, data: "ObjectNotCreateError" })
            )
    }

    const accessToken = isUserExist.generateAccessToken();


    if(!accessToken)
    {
        return res.status(500)
        .json(
            new ApiResponse(500,"accesstoken not generates" , {success:false , data:"ObjectNotCreatedError"})
        )
    }

    return res.status(200)
    .json(
        new ApiResponse(200 , "accesstoken generated successfully" , {success:true , data:accessToken})
    )

    
})


const login = asyncHandler(async(req,res)=>{
    const  {email ,  password} = req.body;
    
    if (!email || !password) {
        return res.status(400)
            .json(
                new ApiResponse(400, "Please Enter email and password", { success: false, data: "DataNullError" })
            )
    }

    const isUserExist = await User.findOne({ email: email })
    if (!isUserExist) {
        return res.status(400)
            .json(
                new ApiResponse(400, "user is not exist", { success: false, data: "ObjectNotExistNull" })
            )
    }

    const isPasswordCorrect = isUserExist.isPasswordCorrect(password);
    if(!isPasswordCorrect)
    {
        return res.status(400)
        .json(
            new ApiResponse(400,"please enter correct password" , {success:false , data:"please enter correct password"})
        )
    }

    const accessToken = isUserExist.generateAccessToken();

    if(!accessToken)
    {
        return res.status(500)
        .json(
            new ApiResponse(500,"accesstoken not generates" , {success:false , data:"ObjectNotCreatedError"})
        )
    }

    return res.status(200)
    .json(
        new ApiResponse(200 , "accesstoken generated successfully" , {success:true , data:accessToken})
    )


    
})

const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const updateData = { ...req.body };

    if (updateData.email) {
        return res.status(400).json(
            new ApiResponse(400, "Email cannot be updated", {
                success: false,
                data: "EmailUpdateError",
            })
        );
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
    });

    if (!updatedUser) {
        return res.status(404).json(
            new ApiResponse(404, "User not found", {
                success: false,
                data: "UserNotFound",
            })
        );
    }

    return res.status(200).json(
        new ApiResponse(200, "Profile updated successfully", {
            success: true,
            data: updatedUser,
        })
    );
});

const forgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json(
            new ApiResponse(400, "Email is required", {
                success: false,
                data: "MissingEmail",
            })
        );
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json(
            new ApiResponse(404, "User not found", {
                success: false,
                data: "UserNotExist",
            })
        );
    }

    const otp = generateOTP();

    await Otp.create({ email, otp });

    const html = `<h2>Password Reset</h2>
                  <p>Your OTP is: <strong>${otp}</strong></p>
                  <p>This OTP is valid for 5 minutes.</p>`;

    const mailSent = await sendMail("Password Reset OTP", html, email);

    if (!mailSent) {
        return res.status(500).json(
            new ApiResponse(500, "Failed to send OTP", {
                success: false,
                data: "MailSendError",
            })
        );
    }

    return res.status(200).json(
        new ApiResponse(200, "OTP sent to your email", {
            success: true,
            data: null,
        })
    );
});

const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json(
            new ApiResponse(400, "Email and OTP are required", {
                success: false,
                data: "MissingData",
            })
        );
    }

    const existingOtp = await Otp.findOne({ email, otp });

    if (!existingOtp) {
        return res.status(400).json(
            new ApiResponse(400, "Invalid or expired OTP", {
                success: false,
                data: "InvalidOTP",
            })
        );
    }

    await Otp.deleteMany({ email }); // Cleanup used OTPs

    return res.status(200).json(
        new ApiResponse(200, "OTP verified successfully", {
            success: true,
            data: null,
        })
    );
});


//this section about the request swaping

const swapRequest = asyncHandler(async(req,res)=>{})

export {registerUser,login , updateProfile , forgetPassword , verifyOtp , swapRequest}

