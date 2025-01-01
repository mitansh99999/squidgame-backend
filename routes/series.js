const express = require('express');
const router = express.Router();
const Series = require('../models/series');

// Get all series
router.get('/', async (req, res) => {
  try {
    const series = await Series.find();
    res.json(series);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one series by id
router.get('/:id', async (req, res) => {
  try {
    const series = await Series.findById(req.params.id);
    if (!series) return res.status(404).json({ message: 'Series not found' });

    // Map episodes for frontend compatibility
    series.episodes = series.episodes.map((ep) => ({
      ...ep._doc,
      id: ep._id, // Map _id to id
    }));

    res.json(series);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new series
router.post('/', async (req, res) => {
  const series = new Series({
    title: req.body.title,
    description: req.body.description,
    thumbnail: req.body.thumbnail,
    episodes: req.body.episodes,
  });

  try {
    const newSeries = await series.save();
    res.status(201).json(newSeries);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add a new episode to a series
router.post('/:id/episodes', getSeries, async (req, res) => {
  const newEpisode = {
    title: req.body.title,
    description: req.body.description,
    duration: req.body.duration,
    thumbnail: req.body.thumbnail,
    videoUrl: req.body.videoUrl,
  };

  try {
    res.series.episodes.push(newEpisode);
    const updatedSeries = await res.series.save();
    res.status(201).json(updatedSeries);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an episode from a series
router.delete('/:id/episodes/:episodeId', getSeries, async (req, res) => {
  try {
    res.series.episodes = res.series.episodes.filter(ep => ep._id.toString() !== req.params.episodeId);
    const updatedSeries = await res.series.save();
    res.status(200).json(updatedSeries);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a series
router.patch('/:id', getSeries, async (req, res) => {
  Object.assign(res.series, req.body);

  try {
    const updatedSeries = await res.series.save();
    res.json(updatedSeries);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a series
router.delete('/:id', getSeries, async (req, res) => {
  try {
    await res.series.remove();
    res.json({ message: 'Deleted Series' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get series by id
async function getSeries(req, res, next) {
  let series;
  try {
    series = await Series.findById(req.params.id);
    if (!series) {
      return res.status(404).json({ message: 'Cannot find series' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.series = series;
  next();
}

module.exports = router;
