import express from 'express';
import Complaint from '../models/Complaint.js';
import User from '../models/User.js';

const router = express.Router();

const punishments = [
  "Make chai for everyone for a week",
  "You owe everyone samosas",
  "Clean the entire kitchen for a week",
  "Buy groceries for the flat this month",
  "Do everyone's laundry for a week",
  "Cook dinner for everyone this weekend",
  "Clean all bathrooms for a week",
  "Take out trash for a month",
  "Vacuum the entire flat weekly for a month",
  "Buy pizza for everyone next Friday"
];

// Get all complaints for user's flat
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find({ 
      flatCode: req.user.flatCode,
      status: { $ne: 'Archived' }
    })
    .populate('filedBy', 'username avatar')
    .populate('againstUser', 'username avatar')
    .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// File a new complaint
router.post('/', async (req, res) => {
  try {
    const { title, description, category, severity, againstUserId } = req.body;

    const complaint = new Complaint({
      title,
      description,
      category,
      severity,
      filedBy: req.user._id,
      againstUser: againstUserId,
      flatCode: req.user.flatCode
    });

    await complaint.save();
    await complaint.populate('filedBy', 'username avatar');
    await complaint.populate('againstUser', 'username avatar');

    // Increment complaints against the user
    await User.findByIdAndUpdate(againstUserId, {
      $inc: { complaintsAgainst: 1 }
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Vote on a complaint
router.post('/:id/vote', async (req, res) => {
  try {
    const { type } = req.body; // 'upvote' or 'downvote'
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check if user already voted
    const existingVote = complaint.votes.find(
      vote => vote.user.toString() === req.user._id.toString()
    );

    if (existingVote) {
      // Update existing vote
      existingVote.type = type;
    } else {
      // Add new vote
      complaint.votes.push({
        user: req.user._id,
        type
      });
    }

    // Recalculate vote counts
    complaint.upvotes = complaint.votes.filter(vote => vote.type === 'upvote').length;
    complaint.downvotes = complaint.votes.filter(vote => vote.type === 'downvote').length;

    // Generate punishment if upvotes >= 10
    if (complaint.upvotes >= 10 && !complaint.punishment) {
      complaint.punishment = punishments[Math.floor(Math.random() * punishments.length)];
    }

    // Auto-archive if downvotes > upvotes after 3 days
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    if (complaint.createdAt < threeDaysAgo && complaint.downvotes > complaint.upvotes) {
      complaint.status = 'Archived';
    }

    await complaint.save();
    await complaint.populate('filedBy', 'username avatar');
    await complaint.populate('againstUser', 'username avatar');

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Resolve a complaint
router.put('/:id/resolve', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = 'Resolved';
    complaint.resolvedBy = req.user._id;
    complaint.resolvedAt = new Date();

    await complaint.save();

    // Award karma points to resolver
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { karmaPoints: 10, complaintsResolved: 1 }
    });

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get trending complaints (most upvoted)
router.get('/trending', async (req, res) => {
  try {
    const complaints = await Complaint.find({
      flatCode: req.user.flatCode,
      status: 'Active'
    })
    .populate('filedBy', 'username avatar')
    .populate('againstUser', 'username avatar')
    .sort({ upvotes: -1 })
    .limit(10);

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;