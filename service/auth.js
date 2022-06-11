const appError = require('../service/appError');
const handleErrorAsync = require('../service/handleErrorAsync');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

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
                // token 過期時，回傳 401 或 403
                reject(next(appError(401, '驗證 token 發生問題'), next));
            } else {
                resolve(payload);
            }
        });
    });
    const currentUser = await User.findById(decoded.id);

    req.user = currentUser;
    next();
});

module.exports = {
    isAuth,
    generatedSendJWT
};