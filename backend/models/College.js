const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true
  },

  cutoffs: {
    GM: {
      type: Number,
      default: null
    },

    GMK: {
      type: Number,
      default: null
    },

    GMR: {
      type: Number,
      default: null
    }
  }
});

const collegeSchema = new mongoose.Schema({
  collegeCode: {
    type: String,
    required: true,
    unique: true
  },

  collegeName: {
    type: String,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  district: {
    type: String,
    default: ""
  },

  collegeType: {
    type: String,
    default: ""
  },

  courses: [courseSchema]
});

module.exports = mongoose.model("College", collegeSchema);