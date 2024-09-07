import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; 
    req.user = null;

    if (!token) {
        return next(new ApiError(401, "No token provided, authorization denied"));
    }

    try {
        console.log(req.user);
        console.log(token);
        console.log("-------------");
        console.log(process.env.ACCESS_TOKEN_SECRET);
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded; 
        console.log(req.user);
        next();
    } catch (error) {
        next(new ApiError(403, "Invalid token, authorization denied"));
    }
};

export default authenticateUser;
