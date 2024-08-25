import { Router } from "express";
import { createProposal, getProposals,getProposalbyId,updateProposal,deleteProposal } from "../Controller/proposal.js";

const router = Router();

router.route("/").post(createProposal);
router.route("/").get(getProposals);
router.route("/:id").get(getProposalbyId);
router.route("/:id").put(updateProposal);
router.route("/:id").delete(deleteProposal);

export default router;
