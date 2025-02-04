const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a class name'],
  },
  description: {
    type: String,
    required: false,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  maxStudents: {
    type: Number,
    default: 60,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  fee: {
    type: Number,
    required: true,
    default: 1000, // Default fee per class
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Class', classSchema);