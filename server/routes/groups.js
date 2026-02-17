const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   POST /api/groups
// @access  Private
router.get('/', protect, (req, res) => {
    console.log('GET /api/groups called');
    res.json({ message: 'Groups endpoint' });
});

router.post('/', protect, async (req, res) => {
    const { name } = req.body;

    try {
        if (!name) {
            return res.status(400).json({ message: 'Group name is required' });
        }

        // Generate invite code
        const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const group = await Group.create({
            name,
            admin: req.user._id,
            inviteCode
        });

        // Update user using findByIdAndUpdate to avoid password hashing issues
        await User.findByIdAndUpdate(req.user._id, {
            groupId: group._id,
            role: 'admin'
        });

        res.status(201).json(group);
    } catch (error) {
        console.error('Group creation error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Join a group via invite code
// @route   POST /api/groups/join
// @access  Private
router.post('/join', protect, async (req, res) => {
    const { inviteCode } = req.body;

    try {
        const group = await Group.findOne({ inviteCode });

        if (!group) {
            return res.status(404).json({ message: 'Invalid invite code' });
        }

        // Update user using findByIdAndUpdate
        await User.findByIdAndUpdate(req.user._id, {
            groupId: group._id,
            role: 'member'
        });

        res.json({
            message: 'Successfully joined group',
            groupId: group._id,
            groupName: group.name
        });
    } catch (error) {
        console.error('Join group error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get group members
// @route   GET /api/groups/members
// @access  Private
router.get('/members', protect, async (req, res) => {
    try {
        const members = await User.find({ groupId: req.user.groupId }).select('name email role avatar');
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Set group settings (income, budget)
// @route   PUT /api/groups/settings
// @access  Private (Admin only)
router.put('/settings', protect, async (req, res) => {
    const { income, budget } = req.body;

    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can change settings' });
        }

        const group = await Group.findById(req.user.groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (income !== undefined) group.income = income;
        if (budget !== undefined) group.budget = budget;

        await group.save();

        res.json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get group details
// @route   GET /api/groups/me
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const group = await Group.findById(req.user.groupId);
        res.json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Leave a group
// @route   POST /api/groups/leave
// @access  Private
router.post('/leave', protect, async (req, res) => {
    try {
        // Update user using findByIdAndUpdate
        await User.findByIdAndUpdate(req.user._id, {
            groupId: null,
            role: 'admin'
        });

        res.json({ message: 'Successfully left group' });
    } catch (error) {
        console.error('Leave group error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
