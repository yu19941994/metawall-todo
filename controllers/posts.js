const Post = require('../model/post');
const User = require('../model/user');
const handleSuccess = require('../service/handleSuccess');
const appError = require('../service/appError');

// 因 body chunk 部分已做處理
const posts = {
    async getPosts(req, res) {
        const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt";
        const q = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {};
        const posts = await Post.find(q).populate({
            path: 'user',
            select: 'name photo'
        }).sort(timeSort);
        handleSuccess(res, posts);
    },
    async createPost(req, res, next) {
        const { body } = req;
        if (!!body.content) {
            const newPost = await Post.create(
                {
                    content: body.content.trim(),
                    image: body.image,
                    name: body.name,
                    user: req.user.id,
                    likes: body.likes
                }
            )
            handleSuccess(res, newPost);
        } else {
            appError(400, 'content 未填寫', next);
        }
    },
    async modifyPost(req, res, next) {
        const id = req.params.id
        const content = req.body.content.trim();
        const isIdExist = await Post.findOne({_id: id});
        if ((!!isIdExist) && (!!content) && (id === isIdExist.id)) {
            await Post.findByIdAndUpdate(id, { content })
            const posts = await Post.find();
            handleSuccess(res, posts);
        } else {
            appError(400, 'content 為空值或無此 ID', next);
        }
    },
    async deletePosts(req, res) {
        await Post.deleteMany({});
        handleSuccess(res, []);
    },
    async deletePost(req, res, next) {
        const id = req.params.id;
        const isIdExist = await Post.findOne({_id: id});
        if (isIdExist && (id === isIdExist.id)) {
            const posts = await Post.findByIdAndDelete(id);
            handleSuccess(res, posts);
        } else {
            appError(400, '無此 ID', next);
        }
    }
}

module.exports = posts;
