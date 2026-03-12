require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Student = require('./model');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-Memory Fallback if MongoDB is not running locally
let useMongoDB = false;
let fallbackDb = [
    { _id: '1', name: 'Rahul Sharma', roomNo: '101-A', course: 'B.Tech CSE', status: 'Active', createdAt: new Date() },
    { _id: '2', name: 'Aman Verma', roomNo: '205-B', course: 'B.Tech ECE', status: 'Active', createdAt: new Date() }
];

// Database Connection
mongoose.connect(process.env.MONGODB_URI, { 
    serverSelectionTimeoutMS: 3000 // 3 seconds timeout
})
    .then(() => {
        console.log('✅ Connected to MongoDB database (hostelsys)');
        useMongoDB = true;
    })
    .catch((err) => {
        console.log('⚠️ MongoDB not detected running locally. Using in-memory array for demo purposes so it works instantly.');
    });

// --- API Routes ---

// Get all students (Read)
app.get('/api/students', async (req, res) => {
    try {
        if (useMongoDB) {
            const students = await Student.find().sort({ createdAt: -1 });
            return res.status(200).json(students);
        } else {
            return res.status(200).json(fallbackDb.sort((a,b) => b.createdAt - a.createdAt));
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch students', details: err.message });
    }
});

// Add a new student (Create)
app.post('/api/students', async (req, res) => {
    try {
        const { name, roomNo, course, status } = req.body;
        
        if (!name || !roomNo || !course) {
            return res.status(400).json({ error: 'Name, Room No, and Course are required fields.' });
        }

        if (useMongoDB) {
            const newStudent = new Student({
                name,
                roomNo,
                course,
                status: status || 'Active'
            });
            const savedStudent = await newStudent.save();
            return res.status(201).json(savedStudent);
        } else {
            const newStudent = {
                _id: Date.now().toString(),
                name,
                roomNo,
                course,
                status: status || 'Active',
                createdAt: new Date()
            };
            fallbackDb.push(newStudent);
            return res.status(201).json(newStudent);
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to add student', details: err.message });
    }
});

// Delete a student (Delete)
app.delete('/api/students/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        
        if (useMongoDB) {
            const deletedStudent = await Student.findByIdAndDelete(studentId);
            if (!deletedStudent) {
                return res.status(404).json({ error: 'Student not found.' });
            }
        } else {
            const initialLength = fallbackDb.length;
            fallbackDb = fallbackDb.filter(s => s._id !== studentId);
            if (fallbackDb.length === initialLength) {
                return res.status(404).json({ error: 'Student not found.' });
            }
        }
        
        res.status(200).json({ message: 'Student deleted successfully.', id: studentId });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete student', details: err.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 API Server running on http://localhost:${PORT}`);
});
