const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
    // Sensitive or additional student details
    medical_history: String,
    emergency_contact: {
        name: String,
        phone: String
    },
    
    // --- One-to-One Relationship with Student ---
    // Each profile belongs to exactly one student.
    // This will hold the Object ID of the Student document.
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // Reference to the 'Student' model
        required: true,
        unique: true   // Ensures a student can only have ONE profile
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);