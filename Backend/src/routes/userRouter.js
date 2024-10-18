import { Router } from "express";
import {register,loginuser} from "../Controller/user.js";
import { upload } from "../middleware/multer.js";
import  authenticateUser  from "../middleware/auth.js";
import { logoutuser, refreshToken,IsLoggedIn,updateuser } from "../Controller/user.js";

const router = Router();
router.route('/register').post(
    upload.fields([
        { 
            name: 'avatar', 
            maxCount: 1 
        }
    ]),
    register
);
router.route('/login').post(loginuser);
router.route('/refreshToken').post(refreshToken); 

router.route("/logout").post(logoutuser);
router.route("/check").get(authenticateUser,IsLoggedIn);
router.route("/update").put(authenticateUser,updateuser);

export default router;