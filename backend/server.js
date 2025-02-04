
// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Address Mongoose Deprecation Warning
mongoose.set('strictQuery', false);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => {
  console.error('MongoDB connection error:', error.message);
  process.exit(1); // Exit process with failure
});

// Middleware to parse JSON
app.use(express.json());

// Configure CORS to allow requests from the frontend
app.use(cors({
  origin: 'http://localhost:3000', // Update this if your frontend runs on a different URL
  credentials: true, // Allow cookies to be sent
}));

// Configure Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret', // Use a strong secret in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}));

// Placeholder Route
app.get('/', (req, res) => {
  res.send('Welcome to the School CRM Backend!');
});

// Import Routes
const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teachers');
const studentRoutes = require('./routes/students');
const classRoutes = require('./routes/classes');
const financialRoutes = require('./routes/financial');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/financial', financialRoutes);

// Error Handling Middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});