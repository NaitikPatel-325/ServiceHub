import { Router } from "express";
import { upload } from "../middleware/multer.js";
import { createIssue, getIssues,getIssuebyId,updateIssue,deleteIssue,getIssuebyReporterId,getProposalbyIssueId,getTaskbyIssueId } from "../Controller/issue.js";

const router = Router();

router.route("/").post(
    upload.fields([
        { 
            name: 'photos', 
            maxCount: 5
        },
        { 
            name: 'video', 
            maxCount: 1
        }
    ]),
    createIssue);
router.route("/").get(getIssues);
router.route("/:id").get(getIssuebyId);
router.route("/:id").put(updateIssue);
router.route("/:id").delete(deleteIssue);
router.route("/user/:id").get(getIssuebyReporterId); 
router.route("/proposal/:id").get(getProposalbyIssueId);
router.route("/task/:id").get(getTaskbyIssueId);

export default router;