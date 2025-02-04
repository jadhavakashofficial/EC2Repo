

// backend/routes/students.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// Create a new Student
router.post('/', protect, authorize('admin','teacher'), async (req, res, next) => {
  const { name, email, gender, profilePicture, dob, contactNumber,feesPaid } = req.body;

  try {
    // Ensure role is 'student'
    let roles=["admin","teacher"]
    // console.log(role)
    // console.log(roles.includes(role))
    // if (!roles.includes(role)) {
    //   return res.status(400).json({ message: 'Role must be student' });
    // }

    // Create new student with plain text password
    const student = await User.create({
      name,
      email,
      gender,
      dob,
      contactNumber,
      feesPaid
      // profile: {
      //   contactNumber,
      //   profilePicture,
      // },
    });

    res.status(204).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      gender: student.gender,
      dob: student.dob,
      profile: student.profile,
      contactNumber:student.contactNumber,
      feesPaid: student.feesPaid,
    });
  } catch (error) {
    // Handle duplicate email error
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    next(error);
  }
});

// Get all Students with Pagination, Filtering, and Sorting
router.get('/', protect, authorize('admin', 'teacher'), async (req, res, next) => {
  const { page = 1, limit = 10, sortBy = 'name', order = 'asc', search = '' } = req.query;

  const sortOrder = order === 'asc' ? 1 : -1;
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder;

  // Build search query
  const searchQuery = {
    role: 'student',
    name: { $regex: search, $options: 'i' }, // Case-insensitive search
  };

  try {
    const students = await User.find(searchQuery)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(searchQuery);

    res.json({
      data: students,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
});

// Get a single Student by ID
router.get('/:id', protect, authorize('admin', 'teacher'), async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    next(error);
  }
});

// Update a Student by ID
router.put('/:id', protect, authorize('admin','teacher'), async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update fields
    const { name, email, password, gender,feesPaid, dob, contactNumber, profilePicture } = req.body;

    student.name = name || student.name;
    student.email = email || student.email;
    student.password = password || student.password;
    student.gender = gender || student.gender;
    student.feesPaid = feesPaid || student.feesPaid;
    student.dob = dob || student.dob;
    student.contactNumber = contactNumber || student.contactNumber;
    student.profilePicture = profilePicture || student.profilePicture;

    await student.save();

    res.status(203).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      role: student.role,
      gender: student.gender,
      feesPaid: student.feesPaid,
      dob: student.dob,
      profile: student.profile,
      contactNumber: student.contactNumber,
    });
  } catch (error) {
    next(error);
  }
});

// Delete a Student by ID
router.delete('/:id', protect, authorize('admin','teacher'), async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.remove();

    res.json({ message: 'Student removed' });
  } catch (error) {
    next(error);
  }
});

module.exports = router; // Correctly export the router
