import ApiResponse from "../utils/ApiResponse.js";
import apierror from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import {Proposal} from "../models/proposal.js";

const createProposal = asyncHandler(async (req, res) => {
    const {description,price,task} = req.body;
    const {id} = req.user;
    if([description,price,task].some((field) => field?.trim()==='')){
        throw new apierror(400,"Please fill all the fields");
    }
    const proposal = await Proposal.create({
        description,
        price,
        task,
        user:id
    });
    if(!proposal){
        throw new apierror(500,"Error in creating proposal");
    }
    return res.status(201).json(new ApiResponse(201,{proposal}));
}
);

const getProposals = asyncHandler(async (req, res) => {
    const proposals = await Proposal.find();
    if(!proposals){
        throw new apierror(404,"No proposals found");
    }
    return res.status(200).json(new ApiResponse(200,{proposals}));
}
);

const updateProposal = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const {description,price,task} = req.body;
    if([description,price,task].some((field) => field?.trim()==='')){
        throw new apierror(400,"Please fill all the fields");
    }
    const proposal = await Proposal.findByIdAndUpdate(id,{
        description,
        price,
        task
    },{new:true});
    if(!proposal){
        throw new apierror(404,"No proposal found");
    }
    return res.status(200).json(new ApiResponse(200,{proposal}));
}
);

const deleteProposal = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const proposal= await Proposal.findByIdAndDelete(id);
    if(!proposal){
        throw new apierror(404,"No proposal found");
    }

    return res.status(200).json(new ApiResponse(200,{proposal}));

}
);

const getProposalbyId = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const proposal= await Proposal.findById(id);
    
    if(!proposal){
        throw new apierror(404,"No proposal found");
    }

    return res.status(200).json(new ApiResponse(200,{proposal}));
}
);

export {createProposal,getProposals,updateProposal,deleteProposal,getProposalbyId};



