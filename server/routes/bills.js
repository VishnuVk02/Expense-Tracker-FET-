const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const { protect } = require('../middleware/auth');

// @desc    Get all bills for the group
// @route   GET /api/bills
router.get('/', protect, async (req, res) => {
    try {
        const bills = await Bill.find({ groupId: req.user.groupId });
        res.json(bills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a new bill
// @route   POST /api/bills
router.post('/', protect, async (req, res) => {
    const { title, description, amount, dueDate } = req.body;

    try {
        const bill = await Bill.create({
            title,
            description,
            amount,
            dueDate,
            userId: req.user._id,
            groupId: req.user.groupId
        });
        res.status(201).json(bill);
    } catch (error) {
        console.error('Bill creation error:', error.message);
        res.status(400).json({ message: error.message });
    }
});

// @desc    Toggle pin status
// @route   PUT /api/bills/:id/pin
router.put('/:id/pin', protect, async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);
        if (!bill) return res.status(404).json({ message: 'Bill not found' });

        bill.isPinned = !bill.isPinned;
        await bill.save();
        res.json(bill);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a bill
// @route   DELETE /api/bills/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);
        if (!bill) return res.status(404).json({ message: 'Bill not found' });

        await bill.deleteOne();
        res.json({ message: 'Bill removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
