// auth controller with login and register using jwt
const User = require('../models/User');
const Notice = require('../models/Notice');
const jwt = require('jsonwebtoken');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public

const generateReferralCode = () => {
    let referralCode = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#$0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
        referralCode += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return referralCode.toUpperCase();
}

exports.register = async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
            phone,
            parentReferralCode: "none",
            referralCode: generateReferralCode()
        });
        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: 360000
            },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        let notice = await Notice.find({});

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }


        if (password !== user.password) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: 360000
            },
            (err, token) => {
                if (err) throw err;
                let { password, ...userWithoutPassword } = user.toObject();
                res.json({ token, user: userWithoutPassword, notice });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}