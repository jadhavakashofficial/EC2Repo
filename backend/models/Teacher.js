// backend/routes/teachers.js

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Teacher = require('../models/Teacher');

// @route   GET /teachers
// @desc    Get all teachers
// @access  Admin
router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const teachers = await Teacher.find();
    res.json({ success: true, data: teachers });
  } catch (err) {
    next(err);
  }
});

// ... other routes (POST, PUT, DELETE) similarly using protect and authorize
