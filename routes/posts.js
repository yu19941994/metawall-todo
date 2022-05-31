const express = require('express');
const router = express.Router();

const PostsControllers = require('../controllers/posts');

router.get('/',  PostsControllers.getPosts);

router.post('/', PostsControllers.createPost);

router.patch('/:id', PostsControllers.modifyPost);

router.delete('/', PostsControllers.deletePosts);

router.delete('/:id', PostsControllers.deletePost);

router.options('/', function(req, res, next) {
    HttpControllers.cors(res);
});

router.options('*', function(req, res, next) {
    HttpControllers.notFound(res);
});

module.exports = router;
