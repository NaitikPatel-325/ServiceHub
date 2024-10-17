import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema({
  issue_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue', 
    required: true
  },
  professional_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  proposal_description: {
    type: String,
    required: true,
    maxlength: 255
  },
  cost_estimate: {
    type: String,
    required: true
  },
  time_estimate_days: {
    type: Number, 
    required: true
  },
  document: {
    type: String,
    default: ""
  },
  solution_provider_id: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export const Proposal = mongoose.model("Proposal", proposalSchema);
