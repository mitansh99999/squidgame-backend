// /api/comments.js

const mongoose = require('mongoose');
const Comment = require('../models/Comment');

mongoose.connect('mongodb+srv://ramu:ramu@cluster0.tbf3s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const comments = await Comment.find();
      const commentsWithId = comments.map(comment => ({
        ...comment.toObject(),
        id: comment._id.toString(),
      }));
      res.status(200).json(commentsWithId);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else if (req.method === 'POST') {
    const { text, author } = req.body;
    if (!text || text.trim() === "") {
      return res.status(400).json({ message: 'Text is required' });
    }

    try {
      const comment = new Comment({
        text,
        author: author || 'Anonymous',
        likes: 0,
        dislikes: 0,
        createdAt: new Date(),
      });
      const newComment = await comment.save();
      res.status(201).json({
        ...newComment.toObject(),
        id: newComment._id.toString(),
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}
