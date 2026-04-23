const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Student = require('../models/Student'); // Needed for unenrollment logic

// --- Course CRUD Operations ---

// GET all courses (with optional population)
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().populate('students', 'first_name last_name email'); // Populate students
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single course by ID (with population)
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('students');
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new course
router.post('/', async (req, res) => {
    const course = new Course(req.body);
    try {
        const newCourse = await course.save();
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT/PATCH update a course
router.patch('/:id', async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedCourse) return res.status(404).json({ message: 'Course not found' });
        res.json(updatedCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a course
router.delete('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        // --- CASCADE DELETE for Many-to-Many (Student Enrollments) ---
        // If a course is deleted, remove it from all students who were enrolled
        if (course.students && course.students.length > 0) {
            await Student.updateMany(
                { _id: { $in: course.students } }, // Find students enrolled in this course
                { $pull: { courses: course._id } } // Remove course's ID from their courses array
            );
        }

        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: 'Course deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;