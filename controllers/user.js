const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

function generatedWebToken (id, name, phone) {
    return jwt.sign({userId: id, name, phone}, process.env.TOKEN_SECRET);
}

const createUser = async (req, res) => {

    try {
        const {name, email, phone, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({name, email, phone, password: hashedPassword});
        res.json({success: true, exists: false, ...user.dataValues, token: generatedWebToken(user.id, user.name, user.phone) });
    } catch(err) {
        console.log(err);
        res.status(500).json({success: false, err: err, message: 'Internal Server Error'});
    }
}

const checkEmail = async (req, res) => {
    const {email} = req.body;

    try {
        const existingUser = await User.findOne({where : { email }});
        if(existingUser) {
            return res.json({ exists: true, error: 'Email already exists'});
        } else {
            return res.json({exists: false});
        }
    } catch(err) {
        res.status(500).json({success: false, message: 'Internal Server Error'});
    }
}

const checkPhone = async (req, res) => {
    const {phone} = req.body;

    try {
        const existingUser = await User.findOne({where : { phone }});
        if(existingUser) {
            return res.json({ exists: true, message: 'phone already exists'});
        } else {
            return res.json({exists: false});
        }
    } catch(err) {
        res.status(500).json({success: false, message: 'Internal Server Error'});
    }
}

module.exports = {
    createUser,
    checkEmail,
    checkPhone
}