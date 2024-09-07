import { Router } from "express";
import { createIssue, getIssues,getIssuebyId,updateIssue,deleteIssue,getIssuebyReporterId,getProposalbyIssueId,getTaskbyIssueId } from "../Controller/issue.js";

const router = Router();

router.route("/").post(createIssue);
router.route("/").get(getIssues);
router.route("/:id").get(getIssuebyId);
router.route("/:id").put(updateIssue);
router.route("/:id").delete(deleteIssue);
router.route("/user/:id").get(getIssuebyReporterId);
router.route("/proposal/:id").get(getProposalbyIssueId);
router.route("/task/:id").get(getTaskbyIssueId);

export default router;