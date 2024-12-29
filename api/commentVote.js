// /api/commentVote.js

import mongoose from 'mongoose';
import Comment from '../models/Comment';

mongoose.connect('mongodb+srv://ramu:ramu@cluster0.tbf3s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function handler(req, res) {
  const { id } = req.query;
  const { isLike } = req.body; // true for like, false for dislike

  if (isLike === undefined) {
    return res.status(400).json({ message: 'Vote type (like or dislike) is required' });
  }

  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (isLike) {
      comment.likes += 1;
    } else {
      comment.dislikes += 1;
    }

    await comment.save();

    res.status(200).json({
      id: comment._id.toString(),
      likes: comment.likes,
      dislikes: comment.dislikes,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
