const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// Get messages from a room
router.get('/room/:roomId', async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId })
      .populate('senderId', 'username avatar')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;