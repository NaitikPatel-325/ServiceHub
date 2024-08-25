import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  issue_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue', 
    required: true
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  status: {
    type: String,
    enum: ['Assigned', 'In Progress', 'Completed', 'Rejected'],
    default: 'Assigned'
  }
}, {
  timestamps: { createdAt: 'assigned_at', updatedAt: 'completed_at' } 
});

// const Task = mongoose.model('Task', taskSchema);

// module.exports = Task;

export const Task = mongoose.model("Task", taskSchema);