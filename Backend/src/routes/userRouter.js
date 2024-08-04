import { Router } from "express";
import {register} from "../Controller/user.js";

const router = Router();
router.route('/login').post(register);

export default router;