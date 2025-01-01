require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const commentRoutes = require('./routes/comments');
const seriesRoutes = require('./routes/series');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://ramu:ramu@cluster0.tbf3s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.use('/api/comments', commentRoutes);
app.use('/api/series', seriesRoutes);
app.use('/api/auth', authRoutes)

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});
app.get('/api/series', async (req, res) => {
  try {
    const series = await Series.find(); // Assuming you're using MongoDB
    res.status(200).json(series);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});
app.get('/api/series', async (req, res) => {
  try {
    const series = await Series.find(); // Assuming you're using MongoDB
    res.status(200).json(series);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
