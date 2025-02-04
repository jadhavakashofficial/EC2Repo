

// backend/routes/classes.js

const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// Create a new Class
router.post('/', protect, authorize('admin'), async (req, res, next) => {
  const { name, description, teacherId, maxStudents, fee } = req.body;

  try {
    // Validate required fields
    if (!name || !teacherId) {
      return res.status(400).json({ message: 'Name and Teacher ID are required' });
    }

    // Verify that the teacher exists and has the 'teacher' role
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(400).json({ message: 'Invalid Teacher ID' });
    }

    // Create new class
    const newClass = await Class.create({
      name,
      description,
      teacher: teacherId,
      maxStudents: maxStudents || 60, // Default to 60 if not provided
      fee: fee || 1000, // Default fee
    });

    res.status(201).json(newClass);
  } catch (error) {
    next(error);
  }
});

// Get all Classes with Pagination, Filtering, and Sorting
router.get('/', protect, authorize('admin', 'teacher', 'student'), async (req, res, next) => {
  const { page = 1, limit = 10, sortBy = 'name', order = 'asc', search = '' } = req.query;

  const sortOrder = order === 'asc' ? 1 : -1;
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder;

  // Build search query
  const searchQuery = {
    name: { $regex: search, $options: 'i' }, // Case-insensitive search
  };
 
  try {
    const classes = await Class.find(searchQuery)
      .populate('teacher', 'name email') // Populate teacher details
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Class.countDocuments(searchQuery);

    res.json({
      data: classes,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
});

// Get a single Class by ID
router.get('/:id', protect, authorize('admin', 'teacher'), async (req, res, next) => {
  try {
    const classItem = await Class.findById(req.params.id).populate('teacher', 'name email');

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json(classItem);
  } catch (error) {
    next(error);
  }
});

// Update a Class by ID
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const classItem = await Class.findById(req.params.id);

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Update fields
    const { name, description, teacherId, maxStudents, fee } = req.body;

    if (teacherId) {
      // Verify that the new teacher exists and has the 'teacher' role
      const newTeacher = await User.findById(teacherId);
      if (!newTeacher || newTeacher.role !== 'teacher') {
        return res.status(400).json({ message: 'Invalid Teacher ID' });
      }
      classItem.teacher = teacherId;
    }

    classItem.name = name || classItem.name;
    classItem.description = description || classItem.description;
    classItem.maxStudents = maxStudents || classItem.maxStudents;
    classItem.fee = fee || classItem.fee;

    await classItem.save();

    res.json(classItem);
  } catch (error) {
    next(error);
  }
});

// Delete a Class by ID
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const classItem = await Class.findById(req.params.id);

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    await classItem.remove();

    res.json({ message: 'Class removed' });
  } catch (error) {
    next(error);
  }
});

module.exports = router; // Correctly export the router
