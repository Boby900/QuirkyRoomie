import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  flatCode: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    minlength: 4,
    maxlength: 8
  },
  avatar: {
    type: String,
    default: ''
  },
  karmaPoints: {
    type: Number,
    default: 0
  },
  complaintsResolved: {
    type: Number,
    default: 0
  },
  complaintsAgainst: {
    type: Number,
    default: 0
  },
  badges: [{
    name: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);