const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const user = new User({
            name,
            email,
            password,
            role,
        });

        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Server error',
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                message: 'Invalid credentials',
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
        });
    }
};

module.exports = { register, login };
