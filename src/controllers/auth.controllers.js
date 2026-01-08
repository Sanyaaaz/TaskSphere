import {User} from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { sendEmail } from "../utils/mail.js";
import { emailVerificationMailgenContent } from "../utils/mail.js";

const generateAccessAndRefreshTokens=async(userId)=>{
    try{
        const user=await User.findById(userId);
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();
        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false});
        return {accessToken,refreshToken};
    }catch(error){
        throw new ApiError(500,"Failed to generate tokens",[]);
    }
}

const registerUser=asyncHandler(async(req,res)=>{
    const {email,username,password,role}=req.body;

    const existingUser=await User.findOne({$or:[{email},{username}]});
    if(existingUser){
        throw new ApiError(409,"User already exists with this email",[]);
    }
    const user=await User.create({
        email,
        username,
        password,
        isEmailVerified:false,
    })
    const {unhashedTokens,hashedToken,tokenExpiry}=user.generateTemporaryToken();
    user.emailVerificationToken=hashedToken;
    user.emailVerificationTokenExpiry=tokenExpiry;
    await user.save({validateBeforeSave:false});
    await sendEmail({
        email:user.email,
        subject:"Verify your email address",
        mailgenContent:emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedTokens}`
        )
    })
    const createdUser=await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry -passwordResetToken -passwordResetTokenExpiry");
    if(!createdUser){
        throw new ApiError(500,"Failed to create user",[]);
    }
    return res.status(201).json(new ApiResponse(200,{user:createdUser}, "User registered successfully. Please verify your email address."));
});
const login= asyncHandler(async(req,res)=>{
    const{email,password,username}=req.body;
    if(!email){
        throw new ApiError(400,"Email is required",[]);
    }
    const user=await User.findOne({email})
    if(!user){
        throw new ApiError(404,"User not found",[]);
    }
    const isPasswordValid=await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid credentials",[]);
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id);
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry -passwordResetToken -passwordResetTokenExpiry");
    const options={
        httpOnly:true,
        secure:true,
       
    };
    return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(new ApiResponse(200,{user:loggedInUser,accessToken,refreshToken},"User logged in successfully"));

});
export { registerUser,login };