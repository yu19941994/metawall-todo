const Post = require('../model/post');
const handleSuccess = require('../service/handleSuccess');
const handleError = require('../service/handleError');

// 因 body chunk 部分已做處理
const posts = {
    async getPosts(req, res) {
        const posts = await Post.find();
        handleSuccess(res, posts);
    },
    async createPost(req, res) {
        try {
            const { body } = req;
            if (!!body.content) {
                const newPost = await Post.create(
                    {
                        content: body.content,
                        image: body.image,
                        name: body.name,
                        likes: body.likes
                    }
                )
                handleSuccess(res, newPost);
            } else {
                handleError(res);
            }
        } catch (error) {
            handleError(res, error);
        }
    },
    async modifyPost(req, res) {
        try {
            const id = req.params.id
            const content = req.body.content;
            const isIdExist = await Post.findOne({_id: id});
            if ((!!isIdExist) && (!!content)) {
                await Post.findByIdAndUpdate(id, { content })
                const posts = await Post.find();
                handleSuccess(res, posts);
            } else {
                handleError(res);
            }
        } catch (error) {
            handleError(res, error);
        }
    },
    async deletePosts(req, res) {
        await Post.deleteMany({});
        handleSuccess(res, []);
    },
    async deletePost(req, res) {
        try {
            const id = req.params.id;
            const isIdExist = await Post.findOne({_id: id});
            if (isIdExist) {
                const posts = await Post.findByIdAndDelete(id);
                handleSuccess(res, posts);
            } else {
                handleError(res);
            }
        } catch (error) {
            handleError(res, error);
        }
    }
}

module.exports = posts;
