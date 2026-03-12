# AI Driven Full Stack Development (AI308B)
## Moodle MSE1 Submission Format

**Name:** Priyesh Kumar  
**Branch:** [Enter Branch]  
**Roll Number:** [Enter Roll Number]  
**Section:** [Enter Section]  
**Shift:** [Enter Shift]  
**Case Study Name:** Library Management System  

***

### 1. GitHub Repository Link 
**[https://github.com/Priyesh288/mse-1-aifsd-priyesh-kumar](https://github.com/Priyesh288/mse-1-aifsd-priyesh-kumar)**

***

### 2. Render Deployment Links for all Routes
*(Wait for final Render deployment. Replace below links when deployed)*
- **Frontend URL:** `[Render Frontend URL]`
- **Backend API URL:** `[Render Backend URL]/books`

***

### 3. Project code which is used in the project development.

#### • `index.js`
```javascript
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Book = require('./model');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
.then(() => console.log('✅ Connected to MongoDB database'))
.catch((err) => console.log('⚠️ MongoDB connection error:', err.message));

app.get('/books/search', async (req, res, next) => {
    try {
        const titleQuery = req.query.title;
        if (!titleQuery) return res.status(400).json({ error: 'Search query "title" is required' });
        
        const books = await Book.find({
            $or: [
                { title: { $regex: titleQuery, $options: 'i' } },
                { author: { $regex: titleQuery, $options: 'i' } }
            ]
        });
        return res.status(200).json(books);
    } catch (err) { next(err); }
});

app.post('/books', async (req, res, next) => {
    try {
        const newBook = new Book(req.body);
        const savedBook = await newBook.save();
        return res.status(201).json(savedBook);
    } catch (err) {
        if (err.name === 'ValidationError') return res.status(400).json({ error: 'Bad Request', details: err.message });
        if (err.code === 11000) return res.status(400).json({ error: 'Bad Request', details: 'ISBN must be unique' });
        next(err);
    }
});

app.get('/books', async (req, res, next) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        return res.status(200).json(books);
    } catch (err) { next(err); }
});

app.get('/books/:id', async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ error: 'Not Found: Book does not exist' });
        return res.status(200).json(book);
    } catch (err) {
        if (err.name === 'CastError') return res.status(400).json({ error: 'Bad Request: Invalid Book ID format' });
        next(err);
    }
});

app.put('/books/:id', async (req, res, next) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedBook) return res.status(404).json({ error: 'Not Found: Book does not exist' });
        return res.status(200).json(updatedBook);
    } catch (err) {
        if (err.name === 'ValidationError' || err.name === 'CastError') return res.status(400).json({ error: 'Bad Request', details: err.message });
        next(err);
    }
});

app.delete('/books/:id', async (req, res, next) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) return res.status(404).json({ error: 'Not Found: Book does not exist' });
        return res.status(200).json({ message: 'Success: Book deleted', id: req.params.id });
    } catch (err) {
        if (err.name === 'CastError') return res.status(400).json({ error: 'Bad Request: Invalid Book ID format' });
        next(err);
    }
});

app.use((err, req, res, next) => res.status(500).json({ error: 'Server Error', details: err.message }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
```

#### • `.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/librarysys
```

#### • `model.js`
```javascript
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: [true, 'Title is required'], trim: true },
    author: { type: String, required: [true, 'Author is required'], trim: true },
    isbn: { type: String, required: [true, 'ISBN is required'], unique: true, trim: true },
    genre: { type: String, required: [true, 'Genre is required'], trim: true },
    publisher: { type: String, required: [true, 'Publisher is required'], trim: true },
    publicationYear: { type: Number },
    totalCopies: { type: Number, required: [true, 'Total Copies is required'], min: [1, 'Total Copies must be a positive number'] },
    availableCopies: { type: Number },
    shelfLocation: { type: String },
    bookType: { type: String, enum: ['Reference', 'Circulating'], default: 'Circulating' },
    status: { type: String, enum: ['Available', 'Checked Out'], default: 'Available' }
}, { timestamps: true });

bookSchema.pre('save', function(next) {
    if (this.isNew && this.availableCopies === undefined) {
        this.availableCopies = this.totalCopies;
    }
    next();
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
```

***

### 4. Screenshots of All APIs testing after deployment on Render.
*(Leave empty until Render deployment is fully completed. To generate these, use Postman/Browser to hit your Render URLs and attach screenshots here)*

[ Insert Screenshots Here ]

***

### 5. Screenshot of VS Code Project Structure.
*(Open VS Code, expand the `mse 1 aifsd priyesh kumar` folder on the left side, take a screenshot and paste it below)*

[ Insert VS Code Screenshot Here ]
