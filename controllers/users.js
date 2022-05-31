const Post = require('../model/post');
const User = require('../model/user');
const handleSuccess = require('../service/handleSuccess');
const handleError = require('../service/handleError');

// 因 body chunk 部分已做處理
const users = {
    async getUsers(req, res) {
        const users = await Post.find();
        handleSuccess(res, users);
    },
}

module.exports = users;
