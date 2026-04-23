const express = require('express');
const router = express.Router();
const StudentProfile = require('../models/StudentProfile');
const Student = require('../models/Student'); // Needed to link profile to student

// --- StudentProfile CRUD Operations ---

// GET all profiles (with student populated)
router.get('/', async (req, res) => {
    try {
        const profiles = await StudentProfile.find().populate('student', 'first_name last_name email');
        res.json(profiles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single profile by ID (with student populated)
router.get('/:id', async (req, res) => {
    try {
        const profile = await StudentProfile.findById(req.params.id).populate('student');
        if (!profile) return res.status(404).json({ message: 'Profile not found' });
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new profile for a student (One-to-One)
router.post('/:studentId', async (req, res) => {
    const { studentId } = req.params;
    const { medical_history, emergency_contact } = req.body;

    try {
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        if (student.student_profile) return res.status(400).json({ message: 'Student already has a profile' });

        const profile = new StudentProfile({
            student: studentId,
            medical_history,
            emergency_contact
        });

        const newProfile = await profile.save();

        // Update the student to reference this new profile
        student.student_profile = newProfile._id;
        await student.save();

        res.status(201).json(newProfile);
    } catch (err) {
        // Handle unique constraint violation for student field
        if (err.code === 11000) { // MongoDB duplicate key error code
            return res.status(400).json({ message: 'A profile for this student already exists.' });
        }
        res.status(400).json({ message: err.message });
    }
});

// PATCH update a student profile
router.patch('/:id', async (req, res) => {
    try {
        const updatedProfile = await StudentProfile.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedProfile) return res.status(404).json({ message: 'Profile not found' });
        res.json(updatedProfile);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a student profile
router.delete('/:id', async (req, res) => {
    try {
        const profile = await StudentProfile.findById(req.params.id);
        if (!profile) return res.status(404).json({ message: 'Profile not found' });

        // --- Remove reference from Student document ---
        // Find the student and unset their student_profile field
        await Student.findByIdAndUpdate(profile.student, { $unset: { student_profile: 1 } });

        await StudentProfile.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student profile deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;