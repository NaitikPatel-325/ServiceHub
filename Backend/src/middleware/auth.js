import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

const authenticateUser = (req, res, next) => {
    // console.log("authenticating user",req.headers);
    console.log(req.cookies);
    const token = req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1]; 
    // console.log(token)
    req.user = null;
    // console.log(token);
    if (!token) {
        return next(new ApiError(401, "No token provided, authorization denied"));
    }

    try {
        // console.log(req.user);
        // console.log(token);
        // console.log("-------------");
        // console.log(process.env.ACCESS_TOKEN_SECRET);
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded; 
        // console.log(req.user);
        next();
    } catch (error) {
        next(new ApiError(403, "Invalid token, authorization denied"));
    }
};

export default authenticateUser;
