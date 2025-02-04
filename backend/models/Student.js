// backend/models/Student.js

const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
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
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Please specify gender'],
  },
  feesPaid: {
    type: Number,
    default: 0,
    min: [0, 'Fees paid must be a positive number'],
  },
  dob: {
    type: Date,
    required: [true, 'Please add Date of Birth'],
  },
  contactNumber: {
        type: String,
        required: [false, 'Please add a contact number'],
      },
  // profile: {
  //   contactNumber: {
  //     type: String,
  //     required: [false, 'Please add a contact number'],
  //   },
  //   profilePicture: {
  //     type: String,
  //     default: 'default-profile.png',
  //   },
    // Add more profile fields as necessary
  // },
  // Add more fields as necessary
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
