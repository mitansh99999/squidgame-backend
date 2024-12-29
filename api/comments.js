const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Add a comment
router.post('/', async (req, res) => {
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
});

// Get all comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find();
    const commentsWithId = comments.map(comment => ({
      ...comment.toObject(),
      id: comment._id.toString(),
    }));
    res.json(commentsWithId);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one comment by id
router.get('/:id', getComment, (req, res) => {
  const commentWithId = {
    ...res.comment.toObject(),
    id: res.comment._id.toString(),
  };
  res.json(commentWithId);
});

// Add a reply to a comment
router.post('/:id/replies', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const reply = {
      text: req.body.text,
      author: req.body.author || 'Anonymous',
      likes: 0,
      dislikes: 0,
      createdAt: new Date(),
      id: new Date().toISOString(), // Generate a unique ID for the reply
    };

    // Add the new reply to the comment's replies array
    comment.replies.push(reply);

    // Save the updated comment with the new reply
    await comment.save();

    // Send back only the updated replies list
    const updatedComment = await Comment.findById(req.params.id);
    res.status(201).json(updatedComment.replies); // Send back only the updated replies array
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Vote (Like/Dislike) on a comment
router.post('/:id/vote', async (req, res) => {
  const { isLike } = req.body; // true for like, false for dislike
  if (isLike === undefined) {
    return res.status(400).json({ message: 'Vote type (like or dislike) is required' });
  }

  try {
    // Find the comment
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Update the like/dislike counters
    if (isLike) {
      comment.likes += 1;
    } else {
      comment.dislikes += 1;
    }

    // Save the updated comment
    await comment.save();

    // Respond with the updated comment data
    res.json({
      id: comment._id.toString(),
      likes: comment.likes,
      dislikes: comment.dislikes,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get comment by id
async function getComment(req, res, next) {
  let comment;
  try {
    comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Cannot find comment' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.comment = comment;
  next();
}

module.exports = router;
