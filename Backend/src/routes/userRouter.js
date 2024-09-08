import { Router } from "express";
import {register,loginuser} from "../Controller/user.js";
import { upload } from "../middleware/multer.js";
import  authenticateUser  from "../middleware/auth.js";
import { logoutuser, refreshToken } from "../Controller/user.js";

const router = Router();
router.route('/register').post(
    upload.fields([
        { 
            name: 'avatar', 
            maxCount: 1 
        },
        { 
            name: 'certificate', 
            maxCount: 1 
        }
    ]),
    register
);
router.route('/login').post(loginuser);
router.route('/refreshToken').post(refreshToken); //we will use this route to refresh the token in frontend

router.route("/logout").post(
    authenticateUser,
    logoutuser);
export default router;