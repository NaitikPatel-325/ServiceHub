import {User} from "../models/user.js";
import ApiResponse from "../utils/ApiResponse.js";
import apierror from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const register = asyncHandler(async (req, res) => {
    // console.log(req.body);
    const{fullName,email,username,password}  = req.body;
    // console.log(fullName,email,username,password);  

    if([fullName,email,username,password].some((field) => field?.trim()==='')){
        throw new apierror(400,"Please fill all the fields");
    }

    const existeduser =await User.findOne({
        $or:[{email},{username}]
    })

    if(existeduser){
        throw new apierror(409,"User already exists");
    }


    // console.log(avatar.url);
    const user = await User.create({
        fullName,
        email,
        username : username.toLowerCase(),
        password,
    });

    const saveduser = await User.findById(user._id).select("-password -refreshToken");
    if(!saveduser){
        throw new apierror(500,"Error in creating user");
    }
    // console.log("saved" + saveduser);
    return res.status(201).json(new ApiResponse(200,"User registered successfully",{user:saveduser}));  
})

const loginuser = asyncHandler(async (req, res) => {
    const{email,username,password}  = req.body;
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