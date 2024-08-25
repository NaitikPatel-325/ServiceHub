import { Router } from "express";
import { createTask, getTasks,getTaskbyId,updateTask,deleteTask } from "../Controller/task.js";

const router = Router();

router.route("/").post(createTask);
router.route("/").get(getTasks);
router.route("/:id").get(getTaskbyId);
router.route("/:id").put(updateTask);
router.route("/:id").delete(deleteTask);

export default router;