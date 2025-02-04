// backend/routes/financial.js

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');

// GET /api/financial/analytics
// This endpoint is protected and only accessible by admin users.
// It calculates total teacher salary, total fees collected from students, and profit.
router.get('/analytics', protect, authorize('admin'), async (req, res, next) => {
  try {
    // Fetch all teachers and students from the User collection.
    // (Assuming teachers have role 'teacher' and students have role 'student')
    const teachers = await User.find({ role: 'teacher' });
    const students = await User.find({ role: 'student' });

    // Calculate the total salary paid to teachers.
    const totalSalary = teachers.reduce((acc, teacher) => acc + (teacher.salary || 0), 0);
    
    // Calculate the total fees collected from students.
    const totalFeesCollected = students.reduce((acc, student) => acc + (student.feesPaid || 0), 0);

    // Calculate profit as fees collected minus salaries paid.
    const profit = totalFeesCollected - totalSalary;

    // For period-based analytics, you can extend this by checking a query parameter.
    // For now, we simply return the aggregate data.
    return res.status(200).json({
      data: {
        salary: totalSalary,
        feesCollected: totalFeesCollected,
        profit,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
