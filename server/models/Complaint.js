import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['Noise', 'Cleanliness', 'Bills', 'Pets', 'Kitchen', 'Bathroom', 'Common Area', 'Other']
  },
  severity: {
    type: String,
    required: true,
    enum: ['Mild', 'Annoying', 'Major', 'Nuclear']
  },
  filedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  againstUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  flatCode: {
    type: String,
    required: true,
    uppercase: true
  },
  status: {
    type: String,
    enum: ['Active', 'Resolved', 'Archived'],
    default: 'Active'
  },
  votes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['upvote', 'downvote'],
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  punishment: {
    type: String,
    default: ''
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: {
    type: Date
  },
  isProblemOfTheWeek: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Auto-archive complaints with more downvotes after 3 days
complaintSchema.index({ createdAt: 1 });

export default mongoose.model('Complaint', complaintSchema);