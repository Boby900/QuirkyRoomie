import express from 'express';
import User from '../models/User.js';
import Complaint from '../models/Complaint.js';

const router = express.Router();

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find({ 
      flatCode: req.user.flatCode,
      isActive: true 
    })
    .select('username karmaPoints complaintsResolved complaintsAgainst badges')
    .sort({ karmaPoints: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get flat statistics
router.get('/stats', async (req, res) => {
  try {
    const complaints = await Complaint.find({ flatCode: req.user.flatCode });
    
    const categoryStats = {};
    const severityStats = {};
    
    complaints.forEach(complaint => {
      categoryStats[complaint.category] = (categoryStats[complaint.category] || 0) + 1;
      severityStats[complaint.severity] = (severityStats[complaint.severity] || 0) + 1;
    });

    const totalComplaints = complaints.length;
    const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
    const activeComplaints = complaints.filter(c => c.status === 'Active').length;

    res.json({
      totalComplaints,
      resolvedComplaints,
      activeComplaints,
      categoryStats,
      severityStats,
      resolutionRate: totalComplaints > 0 ? (resolvedComplaints / totalComplaints * 100).toFixed(1) : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get users in flat
router.get('/flatmates', async (req, res) => {
  try {
    const users = await User.find({ 
      flatCode: req.user.flatCode,
      isActive: true,
      _id: { $ne: req.user._id } // Exclude current user
    })
    .select('username email karmaPoints avatar');

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;