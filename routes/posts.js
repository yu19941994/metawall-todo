const express = require('express');
const router = express.Router();
const handleErrorAsync = require('../service/handleErrorAsync');
const { isAuth } = require('../service/auth');
const PostsControllers = require('../controllers/posts');

router.get('/', isAuth, PostsControllers.getPosts);

router.post('/', isAuth, handleErrorAsync(PostsControllers.createPost));

router.patch('/:id', handleErrorAsync(PostsControllers.modifyPost));

router.delete('/', PostsControllers.deletePosts);

router.delete('/:id', handleErrorAsync(PostsControllers.deletePost));

router.options('/', function(req, res, next) {
    HttpControllers.cors(res);
});

router.options('*', function(req, res, next) {
    HttpControllers.notFound(res);
});

module.exports = router;
