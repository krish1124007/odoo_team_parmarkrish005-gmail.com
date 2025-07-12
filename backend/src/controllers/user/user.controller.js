import { User } from "../../models/user.models.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { sendMail } from "../../utils/sendMail.js";
import { generateOTP } from "../../utils/generateOtp.js"
import { Otp } from "../../models/otp.model.js";


const registerUser = asyncHandler(async (req, res) => {
    const {
        email,
        password,
        username,
        profile_photo,
        skills_offered,
        skills_wanted,
        github_profile,
        location,
        availability,
        publicProfile
    } = req.body;

    // Validate required fields
    if (!email || !password || !skills_offered || !skills_wanted || !github_profile) {
        return res.status(400).json(
            new ApiResponse(400, "Required fields missing", {
                success: false,
                data: "MissingFieldsError"
            })
        );
    }

    // Check if user already exists
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
        return res.status(400).json(
            new ApiResponse(400, "User already exists", {
                success: false,
                data: "ObjectAlreadyExistError"
            })
        );
    }

    // Create new user
    const createNewUser = await User.create({
        email,
        password,
        username,
        profile_photo,
        skills_offered,
        skills_wanted,
        github_profile,
        location,
        availability,
        publicProfile
    });

    if (!createNewUser) {
        return res.status(500).json(
            new ApiResponse(500, "User not created", {
                success: false,
                data: "ObjectNotCreateError"
            })
        );
    }

    // Generate JWT token from the newly created user
    const accessToken = createNewUser.generateAccessToken();

    if (!accessToken) {
        return res.status(500).json(
            new ApiResponse(500, "Access token not generated", {
                success: false,
                data: "TokenGenerationError"
            })
        );
    }

    return res.status(201).json(
        new ApiResponse(201, "User registered successfully", {
            success: true,
            data: {
                token: accessToken,
                user: {
                    _id: createNewUser._id,
                    email: createNewUser.email,
                    username: createNewUser.username,
                    profile_photo: createNewUser.profile_photo,
                    skills_offered: createNewUser.skills_offered,
                    skills_wanted: createNewUser.skills_wanted,
                    github_profile: createNewUser.github_profile,
                    location: createNewUser.location,
                    availability: createNewUser.availability,
                    publicProfile: createNewUser.publicProfile
                }
            }
        })
    );
});


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

