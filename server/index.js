require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to Database
if (!process.env.MONGODB_URI) {
    console.error('CRITICAL ERROR: MONGODB_URI is not defined in environment variables.');
    console.log('Please check your .env file in the server directory.');
} else {
    console.log('MONGODB_URI found in environment. Attempting connection...');
}
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Log requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('ExpenseFlow API is running...');
});

// Auth Routes
app.use('/api/auth', require('./routes/auth'));
// Expense Routes
app.use('/api/expenses', require('./routes/expenses'));
// Group Routes
app.use('/api/groups', require('./routes/groups'));
// Bill Routes
app.use('/api/bills', require('./routes/bills'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
