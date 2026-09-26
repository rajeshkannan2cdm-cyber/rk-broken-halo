const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    category: {
      type: String,
      required: [true, 'Please provide a project category'],
      trim: true,
      enum: {
        values: [
          'Anime Edit',
          'Movie Edit',
          'Cinematic Edit',
          'Short-Form Edit',
          'Custom Edit'
        ],
        message: '{VALUE} is not a supported category'
      },
      default: 'Anime Edit'
    },
    description: {
      type: String,
      required: [true, 'Please provide a project description'],
      trim: true
    },
    thumbnail: {
      type: String,
      default: 'avatar.jpeg'
    },
    video: {
      type: String,
      default: 'https://youtube.com/@rk._brokenhalo'
    },
    tools: {
      type: [String],
      default: ['CapCut']
    },
    tags: {
      type: [String],
      default: []
    },
    style: {
      type: String,
      default: 'Cinematic Editing'
    },
    featured: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 1
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Project', projectSchema);
