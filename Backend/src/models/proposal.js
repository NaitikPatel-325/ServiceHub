const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  issue_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue', 
    required: true
  },
  professional_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  proposal_description: {
    type: String,
    required: true,
    maxlength: 255
  },
  cost_estimate: {
    type: mongoose.Types.Decimal128,
    required: true
  },
  time_estimate_days: {
    type: Number, 
    required: true
  }
}, {
  timestamps: true
});

const Proposal = mongoose.model('Proposal', proposalSchema);

module.exports = Proposal;
