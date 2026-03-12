const mongoose = require('mongoose');

// Define Schema for Student
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    roomNo: {
        type: String,
        required: true,
        trim: true
    },
    course: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['Active', 'Pending'],
        default: 'Active'
    }
}, { timestamps: true });

// Create Model
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
