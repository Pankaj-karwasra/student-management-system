const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const StudentProfile = require('../models/StudentProfile');
const Course = require('../models/Course'); // Need Course model for enrollment

// --- Student CRUD Operations ---

// GET all students (with optional population)
router.get('/', async (req, res) => {
    try {
        const students = await Student.find()
            .populate('student_profile', 'medical_history emergency_contact') // Populate profile details
            .populate('courses', 'title code'); // Populate course details
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single student by ID (with population)
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
            .populate('student_profile')
            .populate('courses');
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new student
router.post('/', async (req, res) => {
    const student = new Student(req.body);
    try {
        const newStudent = await student.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT/PATCH update a student
router.patch('/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedStudent) return res.status(404).json({ message: 'Student not found' });
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a student
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        // --- CASCADE DELETE for One-to-One (StudentProfile) ---
        if (student.student_profile) {
            await StudentProfile.findByIdAndDelete(student.student_profile);
        }
        
        // --- CASCADE DELETE for Many-to-Many (Course Enrollments) ---
        // If a student is deleted, remove them from all courses they were enrolled in
        if (student.courses && student.courses.length > 0) {
            await Course.updateMany(
                { _id: { $in: student.courses } }, // Find courses where this student is enrolled
                { $pull: { students: student._id } } // Remove student's ID from those courses' students array
            );
        }

        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// --- Relationship Management Routes for Student ---

// POST: Add/Enroll a student in a course (Many-to-Many)
router.post('/:studentId/enroll/:courseId', async (req, res) => {
    try {
        const { studentId, courseId } = req.params;

        const student = await Student.findById(studentId);
        const course = await Course.findById(courseId);

        if (!student) return res.status(404).json({ message: 'Student not found' });
        if (!course) return res.status(404).json({ message: 'Course not found' });

        // Add course to student's courses if not already enrolled
        if (!student.courses.includes(courseId)) {
            student.courses.push(courseId);
            await student.save();
        }

        // Add student to course's students if not already added
        if (!course.students.includes(studentId)) {
            course.students.push(studentId);
            await course.save();
        }

        res.json({ message: 'Student enrolled in course successfully', student, course });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE: Remove a student from a course
router.delete('/:studentId/unenroll/:courseId', async (req, res) => {
    try {
        const { studentId, courseId } = req.params;

        const student = await Student.findById(studentId);
        const course = await Course.findById(courseId);

        if (!student) return res.status(404).json({ message: 'Student not found' });
        if (!course) return res.status(404).json({ message: 'Course not found' });

        // Remove course from student's courses
        student.courses = student.courses.filter(id => id.toString() !== courseId);
        await student.save();

        // Remove student from course's students
        course.students = course.students.filter(id => id.toString() !== studentId);
        await course.save();

        res.json({ message: 'Student unenrolled from course successfully', student, course });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;