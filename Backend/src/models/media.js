const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  issue_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue', 
    required: true
  },
  media_type: {
    type: String,
    enum: ['Image', 'Video'],
    required: true
  },
  file_path: {
    type: String,
    required: true,
    maxlength: 255
  }
}, {
  timestamps: true
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
