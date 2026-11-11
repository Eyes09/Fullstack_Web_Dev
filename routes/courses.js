const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const requireAuth = require('../middleware/auth');

// GET all courses
router.get('/', requireAuth, async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new course
router.post('/', requireAuth, async (req, res) => {
  try {
    const { courseCode, title, department, description } = req.body;
    const newCourse = new Course({ courseCode, title, department, description });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;