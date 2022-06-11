const express = require('express');
const router = express.Router();
const handleErrorAsync = require('../service/handleErrorAsync');
const { isAuth } = require('../service/auth');
const PostsControllers = require('../controllers/posts');

router.get('/posts', isAuth, PostsControllers.getPosts);

router.post('/post', isAuth, handleErrorAsync(PostsControllers.createPost));

router.patch('/post/:id', isAuth, handleErrorAsync(PostsControllers.modifyPost));

router.delete('/posts', isAuth, PostsControllers.deletePosts);

router.delete('/post/:id', isAuth, handleErrorAsync(PostsControllers.deletePost));

router.options('/posts', function(req, res, next) {
    HttpControllers.cors(res);
});

router.options('*', function(req, res, next) {
    HttpControllers.notFound(res);
});

module.exports = router;
