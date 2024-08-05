import { Router } from "express";
import {register,loginuser} from "../Controller/user.js";
import { upload } from "../middleware/multer.js";

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
export default router;