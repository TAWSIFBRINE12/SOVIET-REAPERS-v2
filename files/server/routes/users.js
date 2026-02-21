const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Get all users with rankings
router.get('/ranking', async (req, res) => {
  try {
    const users = await User.find().sort({ points: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user rank (admin only)
router.put('/:id/rank', async (req, res) => {
  try {
    const { rank } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { rank },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update rank' });
  }
});

// Add points to user
router.put('/:id/points', async (req, res) => {
  try {
    const { points } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $inc: { points } },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update points' });
  }
});

module.exports = router;