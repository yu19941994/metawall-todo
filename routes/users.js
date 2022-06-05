const express = require('express');
const router = express.Router();
const User = require('../model/user');
const appError = require('../service/appError');
const handleErrorAsync = require('../service/handleErrorAsync');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const generatedSendJWT = (user, statusCode, res) => {
    // 產生 JWT Token
    const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_DAY
    });
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        user: {
            token,
            name: user.name
        }
    })
};

// 註冊功能
router.post('/sign_up', handleErrorAsync(async (req, res, next) => {
    let { email, password, confirmPassword, name } = req.body;

    // 內容不為空
    if (!email || !password || !confirmPassword || !name) {
        return appError('400', '欄位未填寫正確', next);
    }

    // 密碼正確
    if (password !== confirmPassword) {
        return appError('400', '密碼不一致', next);
    }

    // 密碼 8 碼以上
    if (!validator.isLength(password, { min: 8 })){
        return appError('400', '密碼字數小於 8 碼', next);
    }

    // 是否為 Email
    if (!validator.isEmail(email)) {
        return appError('400', 'Email 格式不正確', next);
    }

    // 加密密碼
    password = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({
        email,
        password,
        name
    });
    generatedSendJWT(newUser, 201, res);
}));

module.exports = router;
