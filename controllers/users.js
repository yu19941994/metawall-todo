const User = require('../model/user');
const appError = require('../service/appError');
const handleSuccess = require('../service/handleSuccess');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { generatedSendJWT } = require('../service/auth');

// 因 body chunk 部分已做處理
const users = {
    async signUp (req, res, next) {
        let { email, password, confirmPassword, name } = req.body;
        // 內容不為空
        if (!email || !password || !confirmPassword || !name) {
            return appError('400', '欄位未填寫正確', next);
        }

        // 如果信箱有註冊過了
        const checkEmail = await User.findOne({ email: email });
        if (!!checkEmail) {
            return appError('400', '此信箱已註冊過囉！', next);
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

        // 暱稱至少 2 個字元以上
        if (!validator.isLength(name, { min: 2 })){
            return appError('400', '暱稱至少 2 個字元以上', next);
        }

        // 加密密碼
        password = await bcrypt.hash(req.body.password, 12);
        const newUser = await User.create({
            email,
            password,
            name
        });
        generatedSendJWT(newUser, 201, res);
    },
    async signIn (req, res, next) {
        const { email, password } = req.body;
        if (!email || !password) {
            return appError(400, '帳號密碼不可為空', next);
        }
        // 密碼 8 碼以上
        if (!validator.isLength(password, { min: 8 })){
            return appError('400', '密碼字數小於 8 碼', next);
        }

        // 是否為 Email
        if (!validator.isEmail(email)) {
            return appError('400', 'Email 格式不正確', next);
        }
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return appError(400, '使用者帳號不存在', next);
        }
        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return appError(400, '您的密碼不正確', next);
        }
        generatedSendJWT(user, 200, res);
    },
    async updatePassword (req, res, next) {
        const { password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return appError(400, '密碼不一致', next);
        }

        const newPassword = await bcrypt.hash(password, 12);

        const user = await User.findByIdAndUpdate(req.user.id, {
            password: newPassword
        });
        generatedSendJWT(user, 200, res);
    },
    async getProfile (req, res, next) {
        res.status(200).json({
            status: 'success',
            user: req.user
        })
    },
    async updateProfile (req, res, next) {
        const { name, photo } = req.body;
        const checkName = name.trim();
        const user = await User.findByIdAndUpdate(req.user.id, { checkName, photo });
        handleSuccess(res, user);
    }
}

module.exports = users;
