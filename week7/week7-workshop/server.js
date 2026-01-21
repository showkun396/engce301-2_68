// ============================================
// ENGCE301 Week 7 Workshop - Main Server
// ============================================

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// Logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ===== ROUTES =====
const booksRouter = require('./routes/books.route');
const membersRouter = require('./routes/members.route');
const borrowingsRouter = require('./routes/borrowings.route');

app.use('/api/books', booksRouter);
app.use('/api/members', membersRouter);
app.use('/api/borrowings', borrowingsRouter);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Week 7 Workshop - SQLite + Layered Architecture',
        endpoints: {
            books: '/api/books',
            members: '/api/members',
            borrowings: '/api/borrowings'
        }
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message
    });
});

// ===== START SERVER =====
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('📚 Library Management System Server Running');
    console.log('='.repeat(60));
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`API Books: http://localhost:${PORT}/api/books`);
    console.log('='.repeat(60));
    console.log('\n📋 Available Endpoints:');
    console.log('  GET    /api/books');
    console.log('  GET    /api/books/search?q=keyword');
    console.log('  POST   /api/borrowings (Borrow a book)');
    console.log('  PUT    /api/borrowings/:id/return (Return a book)');
    console.log('\n' + '='.repeat(60) + '\n');
});