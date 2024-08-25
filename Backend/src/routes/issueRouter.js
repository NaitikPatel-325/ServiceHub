import { Router } from "express";
import { createIssue, getIssues,getIssuebyId,updateIssue,deleteIssue } from "../Controller/issue.js";

const router = Router();

router.route("/").post(createIssue);
router.route("/").get(getIssues);
router.route("/:id").get(getIssuebyId);
router.route("/:id").put(updateIssue);
router.route("/:id").delete(deleteIssue);

export default router;