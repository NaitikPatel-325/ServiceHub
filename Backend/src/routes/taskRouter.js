import { Router } from "express";
import { createTask, getTasks,getTaskbyId,updateTask,assignProfessional,getTaskbyProfessionalId,changestatus } from "../Controller/task.js";

const router = Router();

router.route("/").post(createTask);
router.route("/").get(getTasks);
router.route("/:id").get(getTaskbyId);
router.route("/:id").put(updateTask);
router.route("/professional/:id").get(getTaskbyProfessionalId);
router.route("/assignProfessional").post(assignProfessional);
router.route("/changestatus/:id").put(changestatus);

export default router;