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

// 驗證是否已登入
const isAuth = handleErrorAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return appError(401, '您尚未登入！', next);
    }
    // 驗證 token 正確性
    const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if (err) {
                reject(err);
            } else {
                resolve(payload);
            }
        });
    });
    const currentUser = await User.findById(decoded.id);

    req.user = currentUser;
    next();
});


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

// 登入功能
router.post('/sign_in', handleErrorAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return appError(400, '帳號密碼不可為空', next);
    }
    const user = await User.findOne({ email }).select('+password');
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
        return appError(400, '您的密碼不正確', next);
    }
    generatedSendJWT(user, 200, res);
}));

// 重設密碼
router.post('/updatePassword', isAuth, handleErrorAsync(async (req, res, next) => {
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return appError(400, '密碼不一致', next);
    }

    const newPassword = await bcrypt.hash(password, 12);

    const user = await User.findByIdAndUpdate(req.user.id, {
        password: newPassword
    });
    generatedSendJWT(user, 200, res);
}));

// 取得個人資料
router.get('/profile', isAuth, handleErrorAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        user: req.user
    })
}));

module.exports = router;
