import { Router } from "express";
import { createProposal, getProposals,getProposalbyId,updateProposal,deleteProposal,getProposalbyProfessionalId } from "../Controller/proposal.js";
import { upload } from "../middleware/multer.js";

const router = Router();

router.route("/").post(
    
    upload.fields([
        { 
            name: 'document', 
            maxCount: 1 
        }
    ]),
    createProposal
);

router.route("/").get(getProposals);
router.route("/:id").get(getProposalbyId);
router.route("/:id").put(
    
    upload.fields([
        { 
            name: 'document', 
            maxCount: 1 
        }
    ]),
    updateProposal
);

router.route("/:id").delete(deleteProposal);
router.route("/professional/:id").get(getProposalbyProfessionalId);

export default router;
