import {User} from "../models/user.js";
import ApiResponse from "../utils/ApiResponse.js";
import apierror from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const generateRefreshTokenandaccesstoken = async (id) => {
    const refreshToken = await User.generateRefreshToken(id);
    const accessToken = await User.generateAccessToken(id);
    if(!refreshToken || !accessToken){
        throw new apierror(500,"Error in generating token");
    }

    return {refreshToken,accessToken};
};   

const register = asyncHandler(async (req, res) => {
    console.log(req.body);
    const{fullName,email,username,password,phone_number}  = req.body;
    console.log(fullName,email,username,password);  

    if([fullName,email,username,password].some((field) => field?.trim()==='')){
        throw new apierror(400,"Please fill all the fields");
    }

    const existeduser =await User.findOne({
        $or:[{email},{username}]
    })

    if(existeduser){
        throw new apierror(409,"User already exists");
    }
    console.log(req.files);
    const avatarFile = req.files['avatar'] ? req.files['avatar'][0] : null;
    const certificateFile = req.files['certificate'] ? req.files['certificate'][0] : null;
    const avatar = avatarFile.path;
    const certificate = certificateFile.path;
    if(!avatar){
        throw new apierror(400,"Please upload an avatar");
    }

    console.log(avatar,certificate);
    const user = await User.create({
        fullName,
        email,
        username : username.toLowerCase(),
        password,
        phone_number,
        avatar,
        certificate
    });

    const saveduser = await User.findById(user._id).select("-password -refreshToken");
    if(!saveduser){
        throw new apierror(500,"Error in creating user");
    }

    console.log("saved" + saveduser);
    return res.status(201).json(new ApiResponse(200,"User registered successfully",{user:saveduser}));  
})

const loginuser = asyncHandler(async (req, res) => {
    const{email,username,password}  = req.body;
    console.log(req.body);

    if(!email || !username ){
        throw new apierror(400,"Please provide email or username");
    }

    const user = await User.findOne({ $or: [{ email }, { username }]});

    if(!user){
        throw new apierror(404,"User Does not exist");
    }

    const ismatch = await user.passwordCheck(password);    

    if(!ismatch){
        throw new apierror(401,"Password is incorrect");
    }
    
    const {refreshToken,accessToken} = await generateRefreshTokenandaccesstoken(user._id);

    const loggedinuser = await User.findOne({ $or: [{ email }, { username }]}).select("-password -refreshToken");

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("refreshToken",refreshToken,options)
    .cookie("accessToken",accessToken,options)
    .json(new ApiResponse(200,{user:loggedinuser,accessToken,refreshToken},"User logged in successfully"));

})

export {
    loginuser,
    register
}
