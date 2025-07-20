const express = require('express');
const mongoose = require('mongoose');
const Message = require('./models/message');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection (with error handling)
mongoose.connect('mongodb://localhost:27017/void-messages')
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.static('public'));
app.use(express.json());

// API: Get random message (optimized with $sample)
app.get('/api/message', async (req, res) => {
  try {
    const message = await Message.aggregate([{ $sample: { size: 1 } }]);
    res.json({ text: message[0]?.text || "Nothing here yet. Be the first!" });
  } catch (err) {
    console.error('Error fetching message:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// API: Post a new message
app.post('/api/message', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }
    await Message.create({ text });
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));