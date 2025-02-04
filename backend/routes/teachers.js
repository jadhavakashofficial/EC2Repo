
// backend/routes/teachers.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// Create a new Teacher
router.post('/', protect, authorize('admin'), async (req, res, next) => {
  const { name, email, password, role, gender, contactNumber, profilePicture, salary } = req.body;

  try {
    // Ensure role is 'teacher'
    // console.log(role);
    // if (role !== 'admin') {
    //   return res.status(400).json({ message: 'Role must be admin' });
    // }

    // Create new teacher with plain text password
    const teacher = await User.create({
      name,
      email,
      password, // Storing plain text password (Not recommended for production)
      role,
      gender,
      profile: {
        contactNumber,
        profilePicture,
      },
      salary,
    });

    res.status(201).json({
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      role: teacher.role,
      gender: teacher.gender,
      profile: teacher.profile,
      salary: teacher.salary,
    });
  } catch (error) {
    // Handle duplicate email error
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    next(error);
  }
});

// Get all Teachers with Pagination, Filtering, and Sorting
router.get('/', protect, authorize('admin', 'teacher'), async (req, res, next) => {
  const { page = 1, limit = 10, sortBy = 'name', order = 'asc', search = '' } = req.query;

  const sortOrder = order === 'asc' ? 1 : -1;
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder;

  // Build search query
  const searchQuery = {
    role: 'teacher',
    name: { $regex: search, $options: 'i' }, // Case-insensitive search
  };

  try {
    const teachers = await User.find(searchQuery)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(searchQuery);

    res.json({
      data: teachers,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
});

// Get a single Teacher by ID
router.get('/:id', protect, authorize('admin', 'teacher'), async (req, res, next) => {
  try {
    const teacher = await User.findById(req.params.id);

    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(teacher);
  } catch (error) {
    next(error);
  }
});

// Update a Teacher by ID
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const teacher = await User.findById(req.params.id);

    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Update fields
    const { name, email, password, gender, contactNumber, profilePicture, salary } = req.body;

    teacher.name = name || teacher.name;
    teacher.email = email || teacher.email;
    teacher.password = password || teacher.password;
    teacher.gender = gender || teacher.gender;
    teacher.contactNumber = contactNumber || teacher.contactNumber;
    teacher.profilePicture = profilePicture || teacher.profilePicture;
    teacher.salary = salary || teacher.salary;

    await teacher.save();

    res.status(202).json({
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      role: teacher.role,
      gender: teacher.gender,
      profile: teacher.profile,
      salary: teacher.salary,
    });
  } catch (error) {
    next(error);
  }
});

// Delete a Teacher by ID
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const teacher = await User.findById(req.params.id);

    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    await teacher.remove();

    res.json({ message: 'Teacher removed' });
  } catch (error) {
    next(error);
  }
});

module.exports = router; // Correctly export the router
