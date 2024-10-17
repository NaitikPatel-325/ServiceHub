import ApiResponse from "../utils/ApiResponse.js";
import apierror from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import {Proposal} from "../models/proposal.js";
import { uploadoncloudinary } from "../utils/Cloudinary.js";

const createProposal = asyncHandler(async (req, res) => {
    const {proposal_description,cost_estimate,time_estimate_days} = req.body;
    const solution_provider_id = req.user._id;
    const {issue_id} = req.body;

    if([proposal_description,cost_estimate,time_estimate_days].some((field) => field?.trim()==='')){
        throw new apierror(400,"Please fill all the fields");
    }

    const documentFile = req.files?.['document'] ? req.files['document'][0] : null;
    let document = "";

    if(documentFile && documentFile.path){
        const uploaded_document = await uploadoncloudinary(documentFile.path);
        document = uploaded_document?.url || "";
    }

    console.log("+++++++++++++++++++++++++++++");
    
    console.log(req.body);

    const proposal = await Proposal.create({
        issue_id: issue_id,
        proposal_description: proposal_description,
        cost_estimate: cost_estimate,
        time_estimate_days: time_estimate_days,
        document: document,
        solution_provider_id: solution_provider_id
    });

    if(!proposal){
        throw new apierror(500,"Error in creating proposal");
    }
    return res.status(201).json(new ApiResponse(201,{proposal}));
});

const getProposals = asyncHandler(async (req, res) => {
    const proposals = await Proposal.find().select('-solution_provider_id');
    if(!proposals){
        throw new apierror(404,"No proposals found");
    }
    return res.status(200).json(new ApiResponse(200,{proposals},"All Proposals fetched successfully"));
}
);

const updateProposal = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const {proposal_description,cost_estimate,time_estimate_days} = req.body;
    const solution_provider_id = req.user._id;

    if([proposal_description,cost_estimate,time_estimate_days].some((field) => field?.trim()==='')){
        throw new apierror(400,"Please fill all the fields");
    }

    const documentFile = req.files?.['document'] ? req.files['document'][0] : null;
    let document = "";

    if(documentFile && documentFile.path){
        const uploaded_document = await uploadoncloudinary(documentFile.path);
        document = uploaded_document?.url || "";
    }

    console.log(document);  

    const proposal = await Proposal.findByIdAndUpdate(id,{
        proposal_description: proposal_description,
        cost_estimate: cost_estimate,
        time_estimate_days: time_estimate_days,
        document: document,
        solution_provider_id: solution_provider_id
    },{new:true});

    if(!proposal){
        throw new apierror(404,"No proposal found");
    }

    return res.status(200).json(new ApiResponse(200,{proposal}));
});

const deleteProposal = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const proposal = await Proposal.findByIdAndDelete(id);
    if(!proposal){
        throw new apierror(404,"No proposal found");
    }
    return res.status(200).json(new ApiResponse(200,{proposal}));
});

const getProposalbyId = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const proposal= await Proposal.findById(id).select('-solution_provider_id');

    if(!proposal){
        throw new apierror(404,"No proposal found");
    }

    return res.status(200).json(new ApiResponse(200,{proposal}));
});

const getProposalbyIssueId = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const proposal= await Proposal.find({
        issue_id:id
    }).select('-solution_provider_id');
    console.log("joo", proposal);
    if(!proposal){
        throw new apierror(404,"No proposal found");
    }

    return res.status(200).json(new ApiResponse(200,{proposal}));
});

const getProposalbyProfessionalId = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const proposal= await Proposal.find({
        professional_id:id
    }).select('-solution_provider_id');

    if(!proposal){
        throw new apierror(404,"No proposal found");
    }

    return res.status(200).json(new ApiResponse(200,{proposal}));
});


export {createProposal,getProposals,updateProposal,deleteProposal,getProposalbyId,getProposalbyProfessionalId,getProposalbyIssueId};
