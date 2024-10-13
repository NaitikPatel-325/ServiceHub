import ApiResponse from "../utils/ApiResponse.js";
import apierror from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import {Issue} from "../models/issue.js";
import {Task} from "../models/task.js";
import {Proposal} from "../models/proposal.js";
import { uploadoncloudinary } from "../utils/Cloudinary.js";


const createIssue = asyncHandler(async (req, res) => {
    const { title, description, location, status } = req.body;
    console.log("Entered in request of create issue");
    
    const id = req.user._id;

    if ([title, description, location, status].some((field) => field?.trim() === '')) {
        throw new apierror(400, "Please fill all the fields");
    }

    const photoFiles = req.files['photos'];
    const videoFile = req.files['video'] ? req.files['video'][0] : null;

    if (!photoFiles || photoFiles.length === 0 || photoFiles.length > 5) {
        throw new apierror(400, "You must upload between 1 to 5 photos");
    }

    console.log("Uploaded files:", req.files);
    
    const photoUrls = await Promise.all(
        photoFiles.map(async (file) => {
            const url = await uploadoncloudinary(file.path);
            return url;
        })
    );

    let videoUrl = null;
    if (videoFile) {
        videoUrl = await uploadoncloudinary(videoFile.path);
    }
    let videoUrls = null;
    if(videoUrl != null){
        videoUrls = videoUrl.map(image => image.secure_url);
    }

    let photoUrl = null;
    if(photoUrls != null){
       photoUrl = photoUrls.map(image => image.secure_url);
    }

    console.log("Uploaded files:", photoUrls, videoUrl);   
    const issue = await Issue.create({
        reporter_id: id,
        title,
        description,
        location,
        status,
        photos: photoUrl, 
        video: videoUrls 
    });

    if (!issue) {
        throw new apierror(500, "Error in creating issue");
    }
    
    return res.status(201).json(new ApiResponse(201, { issue }));
});


const getIssues = asyncHandler(async (req, res) => {
    const issues = await Issue.find();
    if(!issues){
        throw new apierror(404,"No issues found");
    }
    return res.status(200).json(new ApiResponse(200,{issues}));
});

const updateIssue = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const {title,description,location,category} = req.body;
    if([title,description,location,category].some((field) => field?.trim()==='')){
        throw new apierror(400,"Please fill all the fields");
    }
    const issue = await Issue.findByIdAndUpdate(id,{
        title,
        description,
        location,
        category
    },{new:true});
    if(!issue){
        throw new apierror(404,"No issue found");
    }
    return res.status(200).json(new ApiResponse(200,{issue}));
});

const deleteIssue = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const issue = await Issue.findByIdAndDelete(id);
    if(!issue){
        throw new apierror(404,"No issue found");
    }
    return res.status(200).json(new ApiResponse(200,{issue}));
});

const getIssuebyId = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const issue= await Issue.findById(id);

    if(!issue){
        throw new apierror(404,"No issue found");
    }
    return res.status(200).json(new ApiResponse(200,{issue}));
});

const getIssuebyReporterId = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const issue= await Issue.find({
        reporter_id:id
    });

    if(!issue){
        throw new apierror(404,"No issue found");
    }

    return res.status(200).json(new ApiResponse(200,{issue}));
});

const getProposalbyIssueId = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const proposal= await Proposal.find({
        issue_id:id
    });

    if(!proposal){
        throw new apierror(404,"No proposal found");
    }

    return res.status(200).json(new ApiResponse(200,{proposal}));
});

const getTaskbyIssueId = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const task= await Task.find({issue_id:id});

    if(!task){
        throw new apierror(404,"No task found");
    }

    return res.status(200).json(new ApiResponse(200,{task}));
});

export {createIssue,getIssues,updateIssue,deleteIssue,getIssuebyId,getIssuebyReporterId,getProposalbyIssueId,getTaskbyIssueId};

