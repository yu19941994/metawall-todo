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

const app = express();

require('./connections');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/posts', postsRouter);
app.use('/users', usersRouter);

module.exports = app;
