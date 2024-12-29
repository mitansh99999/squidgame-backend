// /api/commentReply.js

import mongoose from 'mongoose';
import Comment from '../models/Comment';

mongoose.connect('mongodb+srv://ramu:ramu@cluster0.tbf3s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'POST') {
    try {
      const comment = await Comment.findById(id);
      if (!comment) return res.status(404).json({ message: 'Comment not found' });

      const reply = {
        text: req.body.text,
        author: req.body.author || 'Anonymous',
        likes: 0,
        dislikes: 0,
        createdAt: new Date(),
      };

      comment.replies.push(reply);
      await comment.save();

      res.status(201).json(comment.replies);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}
