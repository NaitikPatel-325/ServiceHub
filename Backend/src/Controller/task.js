import ApiResponse from "../utils/ApiResponse.js";
import apierror from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import {Task} from "../models/task.js";
import {Issue} from "../models/issue.js";
import {Proposal} from "../models/proposal.js";


const getTaskbyProfessionalId = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    console.log(id);
    const tasks = await Task.find({ assigned_to: id });
  
    if (!tasks || tasks.length === 0) {
      throw new apierror(404, "No task found");
    }
  
    const tasksWithIssueDetails = await Promise.all(
      tasks.map(async (task) => {
        const issue = await Issue.findById(task.issue_id); 
        return {
          ...task._doc, 
          issue_name: issue ? issue.title : "Issue not found", 
        };
      })
    );
  
    console.log(tasksWithIssueDetails);
  
    return res.status(200).json(new ApiResponse(200, { tasks: tasksWithIssueDetails }));
  });
  

const changestatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { issue_id } = req.body;  

    const task = await Task.findByIdAndUpdate(
        id,
        { status: 'Completed' },
        { new: true }
    );

    const updatedIssue = await Issue.findByIdAndUpdate(
        issue_id,
        { status: 'Resolved' },
        { new: true }
    );

    if (!updatedIssue) {
        throw new apierror(500, "Error in updating issue status");
    }


    if (!task) {

        throw new apierror(404, "No task found");
    }
    
    return res.status(200).json(new ApiResponse(200, { task }));

});

const createTask = asyncHandler(async (req, res) => {
    const { issue_id, task_description, task_cost, task_estimate_days, task_location, proposal_id } = req.body;

    if ([issue_id, task_description, task_cost, task_estimate_days, task_location].some((field) => typeof field === 'string' && field.trim() === '')) {
        throw new apierror(400, "Please fill all the fields");
    }
    
    const proposal = await Proposal.findById(proposal_id);
    if (!proposal) {
        throw new apierror(404, "Proposal not found");
    }

    const assigned_to = proposal.solution_provider_id;

    const updatedIssue = await Issue.findByIdAndUpdate(
        issue_id,
        { status: 'In Progress' },
        { new: true }
    );

    if (!updatedIssue) {
        throw new apierror(500, "Error in updating issue status");
    }

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

const assignProfessional = asyncHandler(async (req, res) => {
    const { issueId, professionalId } = req.body;

    if (!professionalId || !issueId) {
        throw new apierror(400, "Please fill all the fields");
    }

    const task = await Task.findOneAndUpdate(
        { issue_id: issueId },
        { professional_id: professionalId },
        { new: true } 
    );

    const updatedIssue = await Issue.findByIdAndUpdate(
        issueId,
        { status: 'Accepted' },
        { new: true }
    );

    if (!task) {
        throw new apierror(404, "No task found");
    }

    return res.status(200).json(new ApiResponse(200, { task }));
});

const getTaskbyId = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const task= await Task.findById(id);

    if(!task){
        throw new apierror(404,"No task found");
    }

    return res.status(200).json(new ApiResponse(200,{task}));
});


export {createTask,getTasks,getTaskbyId,updateTask,assignProfessional,getTaskbyProfessionalId,changestatus};