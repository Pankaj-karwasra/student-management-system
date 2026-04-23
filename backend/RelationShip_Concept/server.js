require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/studentdb_relations';

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const studentRoutes = require('./routes/students');
const courseRoutes = require('./routes/courses');
const studentProfileRoutes = require('./routes/studentProfiles');

// Use routes
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/student-profiles', studentProfileRoutes);


// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to Student-Course Relations API!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});