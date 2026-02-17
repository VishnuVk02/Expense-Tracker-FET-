const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');

// @desc    Get all group expenses
// @route   GET /api/expenses
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const expenses = await Expense.find({ groupId: req.user.groupId }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add new expense
// @route   POST /api/expenses
// @access  Private
router.post('/', protect, async (req, res) => {
    const { title, amount, category, date } = req.body;

    try {
        if (!req.user.groupId) {
            return res.status(400).json({ message: 'User must be in a group to add expenses' });
        }

        const expense = await Expense.create({
            title,
            amount,
            category,
            date,
            userId: req.user._id,
            groupId: req.user.groupId,
            addedBy: req.user.name
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Only owner or admin can delete
        if (expense.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'User not authorized' });
        }

        await expense.deleteOne();
        res.json({ message: 'Expense removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
