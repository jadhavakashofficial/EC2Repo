// backend/models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [false, 'Please add a password'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student'],
    default: 'student',
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: false,
  },
  dob: {
    type: Date,
    required: [false, 'Please add Date of Birth'],
  },
  contactNumber: {
    type: String,
    required: false,
  },
  // profile: {
  //   contactNumber: {
  //     type: String,
  //     required: false,
  //   },
  //   profilePicture: {
  //     type: String,
  //     required: false,
  //     default: 'default-profile.png',
  //   },
  // },
  assignedClasses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
    },
  ],
  salary: {
    type: Number,
    required: false,
    // function() { return this.role === 'teacher'; },
  },
  feesPaid: {
    type: Number,
    required: false,
    // function() { return this.role === 'teacher'; },
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);