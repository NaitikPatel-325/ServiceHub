import ApiResponse from "../utils/ApiResponse.js";
import apierror from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import {Task} from "../models/task.js";

const createTask = asyncHandler(async (req, res) => {
    const {title,description,location,category} = req.body;
    const {id} = req.user;
    if([title,description,location,category].some((field) => field?.trim()==='')){
        throw new apierror(400,"Please fill all the fields");
    }
    const task = await Task.create({
        title,
        description,
        location,
        category,
        user:id
    });
    if(!task){
        throw new apierror(500,"Error in creating task");
    }
    res.status(201).json(new ApiResponse(201,{task}));
}
);

const getTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find();
    if(!tasks){
        throw new apierror(404,"No tasks found");
    }
    res.status(200).json(new ApiResponse(200,{tasks}));
}
);

const updateTask = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const {title,description,location,category} = req.body;
    if([title,description,location,category].some((field) => field?.trim()==='')){
        throw new apierror(400,"Please fill all the fields");
    }
    const task = await Task.findByIdAndUpdate(id,{
        title,
        description,
        location,
        category
    },{new:true});
    if(!task){
        throw new apierror(404,"No task found");
    }
    res.status(200).json(new ApiResponse(200,{task}));
}
);

const deleteTask = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const task = await Task.findByIdAndDelete(id);
    if(!task){
        throw new apierror(404,"No task found");
    }
    res.status(200).json(new ApiResponse(200,{task}));
});

const getTaskbyId = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const task= await Task.findById(id);

    if(!task){
        throw new apierror(404,"No task found");
    }
    res.status(200).json(new ApiResponse(200,{task}));
});

export {createTask,getTasks,getTaskbyId,updateTask,deleteTask};