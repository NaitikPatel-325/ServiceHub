const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  reporter_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 255
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    maxlength: 255
  },
  status: {
    type: String,
    enum: ['Reported', 'In Progress', 'Resolved', 'Closed'],
    default: 'Reported'
  }
}, {
  timestamps: true 
});

export const Issue = mongoose.model("Issue", issueSchema);