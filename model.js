const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'Author is required'],
        trim: true
    },
    isbn: {
        type: String,
        required: [true, 'ISBN is required'],
        unique: true,
        trim: true
    },
    genre: {
        type: String,
        required: [true, 'Genre is required'],
        trim: true
    },
    publisher: {
        type: String,
        required: [true, 'Publisher is required'],
        trim: true
    },
    publicationYear: {
        type: Number
    },
    totalCopies: {
        type: Number,
        required: [true, 'Total Copies is required'],
        min: [1, 'Total Copies must be a positive number']
    },
    availableCopies: {
        type: Number
    },
    shelfLocation: {
        type: String
    },
    bookType: {
        type: String,
        enum: ['Reference', 'Circulating'],
        default: 'Circulating'
    },
    status: {
        type: String,
        enum: ['Available', 'Checked Out'],
        default: 'Available'
    }
}, { timestamps: true });

// Pre-save hook to set available copies if not provided
bookSchema.pre('save', function(next) {
    if (this.isNew && this.availableCopies === undefined) {
        this.availableCopies = this.totalCopies;
    }
    next();
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
