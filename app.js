const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// 捕捉程式紀錄
process.on('uncaughtException', err => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
	console.error('Uncaughted Exception！')
	console.error(err);
	process.exit(1);
});

// router
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const uploadRouter = require('./routes/upload');

const app = express();

require('./connections');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', postsRouter);
app.use('/users', usersRouter);
app.use('/upload', uploadRouter);

// express 錯誤處理
// production mode
resErrorProd = (err, res) => {
    if (err.isOperational) {
        // 可預期的錯誤
        res.status(err.statusCode).json({
            message: err.message
        })
    } else if (err.name === SyntaxError && err.name === 'TypeError' && err.name === 'CastError') {
        res.status(400).json({
            message: err.message
        })
    } else {
        // 為非預期的錯誤，傳送罐頭訊息
        console.error('出現重大錯誤', err);
        res.status(500).json({
            status: 'error',
            message: '系統錯誤，請假管理員'
        })
    }
};

// dev
resErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        message: err.message,
        error: err,
        stack: err.stack
    })
};

// 找不到路由的錯誤攔截
app.use((req, res, next) => {
    res.status(404).send({
        status: false,
        message: '無此網路路由'
    })
})

// 判別是 production 還是 dev
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    // dev
    if (process.env.NODE_ENV === 'dev') {
        return resErrorDev(err, res);
    }
    // production
    if (err.name === 'ValidationError') {
        err.message = '資料欄位未填寫正確，請重新輸入！';
        err.isOperational = true;
        return resErrorProd(err, res);
    }
    resErrorProd(err, res);
});

// 未捕捉到的 catch 
process.on('unhandledRejection', (reason, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', reason);
  // 記錄於 log 上
});

module.exports = app;
