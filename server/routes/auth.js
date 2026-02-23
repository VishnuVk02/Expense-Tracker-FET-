const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Group = require('../models/Group');
const { protect } = require('../middleware/auth');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    const { name, username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ $or: [{ email }, { username }] });

        if (userExists) {
            const message = userExists.username === username ? 'username not available' : 'User already exists';
            return res.status(400).json({ message });
        }

        // Create user (initially without a group)
        const user = await User.create({
            name,
            username,
            email,
            password,
            role: 'admin', // Default to admin for their own context
            groupId: null
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                groupId: user.groupId,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                groupId: user.groupId,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', async (req, res) => {
    const { username, email, newPassword } = req.body;

    try {
        const user = await User.findOne({ username, email });

        if (!user) {
            return res.status(404).json({ message: 'User not found with provided username and email' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password reset successfully. You can now log in.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update user settings
// @route   PUT /api/auth/settings
// @access  Private
router.put('/settings', protect, async (req, res) => {
    const { username, avatar, currency } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username && username !== user.username) {
            const usernameExists = await User.findOne({ username });
            if (usernameExists) {
                return res.status(400).json({ message: 'Username already taken' });
            }
            user.username = username;
        }

        if (avatar) user.avatar = avatar;
        if (currency) user.currency = currency;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            avatar: updatedUser.avatar,
            currency: updatedUser.currency,
            groupId: updatedUser.groupId,
            token: generateToken(updatedUser._id) // Return new token just in case
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
