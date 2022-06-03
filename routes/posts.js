const express = require('express');
const router = express.Router();

const PostsControllers = require('../controllers/posts');
const handleErrorAsync = require('../service/handleErrorAsync');

router.get('/',  PostsControllers.getPosts);

router.post('/', handleErrorAsync(PostsControllers.createPost));

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
