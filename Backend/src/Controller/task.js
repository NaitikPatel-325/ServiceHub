import ApiResponse from "../utils/ApiResponse.js";
import apierror from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import {Task} from "../models/task.js";
import {Proposal} from "../models/proposal.js";

const createTask = asyncHandler(async (req, res) => {
    const { issue_id, task_description, task_cost, task_estimate_days, task_location, proposal_id } = req.body;

    if ([issue_id, task_description, task_cost, task_estimate_days, task_location].some((field) => field?.trim() === '')) {
        throw new apierror(400, "Please fill all the fields");
    }

    const proposal = await Proposal.findById(proposal_id);
    if (!proposal) {
        throw new apierror(404, "Proposal not found");
    }

    const assigned_to = proposal.solution_provider_id;

    const task = await Task.create({
        issue_id: issue_id,
        assigned_to: assigned_to,
        status: 'Assigned',  
        task_description: task_description,
        task_cost: task_cost,
        task_estimate_days: task_estimate_days,
    });

    if (!task) {
        throw new apierror(500, "Error in creating task");
    }

    return res.status(201).json(new ApiResponse(201, { task }));
});

const getTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find();
    if(!tasks){
        throw new apierror(404,"No tasks found");
    }
    return res.status(200).json(new ApiResponse(200,{tasks}));
});

const updateTask = asyncHandler(async (req, res) => {

    const {id} = req.params;
    const {issue_id,assigned_to,status,task_description,task_cost,task_estimate_days,task_location} = req.body;

    if([issue_id,assigned_to,status,task_description,task_cost,task_estimate_days,task_location].some((field) => field?.trim()==='')){
        throw new apierror(400,"Please fill all the fields");
    }

    const task = await Task.findByIdAndUpdate(id,{
        issue_id,
        assigned_to,
        status,
        task_description,
        task_cost,
        task_estimate_days,
        task_location
    },{new:true});
    if(!task){
        throw new apierror(404,"No task found");
    }
    return res.status(200).json(new ApiResponse(200,{task}));
});

const deleteTask = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const task = await Task.findByIdAndDelete(id);
    if(!task){
        throw new apierror(404,"No task found");
    }
    return res.status(200).json(new ApiResponse(200,{task}));
});

const getTaskbyId = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const task= await Task.findById(id);

    if(!task){
        throw new apierror(404,"No task found");
    }

    return res.status(200).json(new ApiResponse(200,{task}));
});

const getTaskbyProfessionalId = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const task= await Task.find({assigned_to:id});

    if(!task){
        throw new apierror(404,"No task found");
    }

    return res.status(200).json(new ApiResponse(200,{task}));
});

export {createTask,getTasks,getTaskbyId,updateTask,deleteTask,getTaskbyProfessionalId};