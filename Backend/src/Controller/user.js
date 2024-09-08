import {User} from "../models/user.js";
import ApiResponse from "../utils/ApiResponse.js";
import apierror from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadoncloudinary } from "../utils/Cloudinary.js";

// const generateRefreshTokenandaccesstoken = async (id) => {
//     const refreshToken = await User.generateRefreshToken(id);
//     const accessToken = await User.generateAccessToken(id);
//     if(!refreshToken || !accessToken){
//         throw new apierror(500,"Error in generating token");
//     }

//     return {refreshToken,accessToken};
// };   

const generateRefreshTokenandaccesstoken = async (user) => {
    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();
    if(!refreshToken || !accessToken){
        throw new apierror(500,"Error in generating token");
    }

    return {refreshToken,accessToken};
};

const register = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { fullName, email, username, password, phone_number } = req.body;
    console.log(fullName, email, username, password);

    if ([fullName, email, username, password].some((field) => field?.trim() === '')) {
        throw new apierror(400, "Please fill all the fields");
    }

    const existeduser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existeduser) {
        throw new apierror(409, "User already exists");
    }

    console.log(req.files);

    const avatarFile = req.files?.['avatar'] ? req.files['avatar'][0] : null;
    if (!avatarFile || !avatarFile.path) {
        throw new apierror(400, "Please upload an avatar");
    }

    const avatar = await uploadoncloudinary(avatarFile.path);

    const certificateFile = req.files?.['certificate'] ? req.files['certificate'][0] : null;
    let certificateUrl = "";

    if (certificateFile && certificateFile.path) {
        const certificate = await uploadoncloudinary(certificateFile.path);
        certificateUrl = certificate?.url || "";
    }

    const user = await User.create({
        fullName,
        email,
        username: username.toLowerCase(),
        password,
        phone_number,
        avatar: avatar?.url,
        certificate: certificateUrl
    });

    const saveduser = await User.findById(user._id).select("-password -refreshToken");
    if (!saveduser) {
        throw new apierror(500, "Error in creating user");
    }

    console.log("saved" + saveduser);
    return res.status(201).json(new ApiResponse(200, "User registered successfully", { user: saveduser }));
});

const loginuser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    console.log(req.body);

    if (!email && !username) {
        throw new apierror(400, "Please provide email or username");
    }

    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (!user) {
        throw new apierror(404, "User does not exist");
    }

    const ismatch = await user.passwordCheck(password);

    if (!ismatch) {
        throw new apierror(401, "Password is incorrect");
    }

    const { refreshToken, accessToken } = await generateRefreshTokenandaccesstoken(user);

    const loggedinuser = await User.findOne({ $or: [{ email }, { username }] }).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200, { user: loggedinuser, accessToken, refreshToken }, "User logged in successfully"));
});

const refreshToken = asyncHandler(async (req, res) => {
    const incomingrefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if(!incomingrefreshToken){
        throw new apierror(401,"Unauthorized Request");
    }

    try {
        const decoded = jwt.verify(incomingrefreshToken,process.env.REFRESH_TOKEN_SECRET);
        // console.log(decoded);
        const user = await User.findById(decoded?.id);
        // console.log(user);
 
        if(!user){
            throw new apierror(404,"Invalid Refresh Token");
        }
 
        if(user.refreshToken !== incomingrefreshToken){
            throw new apierror(401,"REFRESH TOKEN EXPIRED");
        }
 
        const options = {
            httpOnly:true,
            secure:true
        }
 
        const {refreshToken,accessToken} = await generateRefreshTokenandaccesstoken(user);
        // console.log(refreshToken,accessToken);
        return res
        .status(200)
        .cookie("refreshToken",refreshToken,options)
        .cookie("accessToken",accessToken,options)
        .json(new ApiResponse(200,"Token Refreshed successfully"));
 
    }catch (error) {
        throw new apierror(401,error?.message || "Unauthorized Request");
    }
});

const logoutuser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        },
    );
    
    const options = {
        httpOnly:true,
        secure:true
    }

    return res.
    status(200)
    .clearCookie("refreshToken",options)
    .clearCookie("accessToken",options)
    .json(new ApiResponse(200,{},"User logged out successfully"));
    
});

export {
    loginuser,
    register,
    refreshToken,
    logoutuser
}
