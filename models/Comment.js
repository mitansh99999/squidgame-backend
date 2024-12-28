const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  text: String,
  author: String,
  likes: Number,
  dislikes: Number,
  createdAt: Date,
});

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { type: String, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    replies: [{
      text: { type: String },
      author: { type: String },
      likes: { type: Number, default: 0 },
      dislikes: { type: Number, default: 0 },
      createdAt: { type: Date, default: Date.now },
    }],
  });
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
