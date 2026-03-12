require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Book = require('./model');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Enable express.json() middleware

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { 
    serverSelectionTimeoutMS: 5000 
})
.then(() => console.log('✅ Connected to MongoDB database'))
.catch((err) => console.log('⚠️ MongoDB connection error:', err.message));

// --- API Endpoints ---

// GET /books/search?title=xyz (Search book by title)
// NOTE: This must come before /books/:id to avoid matching "search" as an ID
app.get('/books/search', async (req, res, next) => {
    try {
        const titleQuery = req.query.title;
        if (!titleQuery) {
            return res.status(400).json({ error: 'Search query "title" is required' });
        }
        
        // Search by title or author
        const books = await Book.find({
            $or: [
                { title: { $regex: titleQuery, $options: 'i' } },
                { author: { $regex: titleQuery, $options: 'i' } }
            ]
        });
        return res.status(200).json(books);
    } catch (err) {
        next(err);
    }
});

// POST /books (Add a new book)
app.post('/books', async (req, res, next) => {
    try {
        const newBook = new Book(req.body);
        const savedBook = await newBook.save();
        return res.status(201).json(savedBook);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: 'Bad Request', details: err.message });
        }
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Bad Request', details: 'ISBN must be unique' });
        }
        next(err);
    }
});

// GET /books (Get all book records)
app.get('/books', async (req, res, next) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        return res.status(200).json(books);
    } catch (err) {
        next(err);
    }
});

// GET /books/:id (Get book by ID)
app.get('/books/:id', async (req, res, next) => {
    try {
        const bookId = req.params.id;
        const book = await Book.findById(bookId);
        
        if (!book) {
            return res.status(404).json({ error: 'Not Found: Book does not exist' });
        }
        return res.status(200).json(book);
    } catch (err) {
        // If id is invalid format, cast to objectid fails
        if (err.name === 'CastError') {
             return res.status(400).json({ error: 'Bad Request: Invalid Book ID format' });
        }
        next(err);
    }
});

// PUT /books/:id (Update book details)
app.put('/books/:id', async (req, res, next) => {
    try {
        const bookId = req.params.id;
        const updatedBook = await Book.findByIdAndUpdate(
            bookId, 
            req.body, 
            { new: true, runValidators: true }
        );
        
        if (!updatedBook) {
            return res.status(404).json({ error: 'Not Found: Book does not exist' });
        }
        return res.status(200).json(updatedBook);
    } catch (err) {
        if (err.name === 'ValidationError' || err.name === 'CastError') {
            return res.status(400).json({ error: 'Bad Request', details: err.message });
        }
        next(err);
    }
});

// DELETE /books/:id (Delete book record)
app.delete('/books/:id', async (req, res, next) => {
    try {
        const bookId = req.params.id;
        const deletedBook = await Book.findByIdAndDelete(bookId);
        
        if (!deletedBook) {
            return res.status(404).json({ error: 'Not Found: Book does not exist' });
        }
        return res.status(200).json({ message: 'Success: Book deleted', id: bookId });
    } catch (err) {
        if (err.name === 'CastError') {
             return res.status(400).json({ error: 'Bad Request: Invalid Book ID format' });
        }
        next(err);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack);
    res.status(500).json({ error: 'Server Error', details: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
