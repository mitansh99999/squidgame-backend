const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  thumbnail: { type: String, required: true },
  videoUrl: { type: String, required: true },
});

const seriesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  episodes: [episodeSchema],
});

const Series = mongoose.model('Series', seriesSchema);

module.exports = Series;
