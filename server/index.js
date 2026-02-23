require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to Database
connectDB();
// const cors = require('cors');



const app = express();
app.use(cors({
    origin: '*', // for now (safe for dev)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Middleware
app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
