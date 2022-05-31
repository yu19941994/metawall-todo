const express = require('express');
const router = express.Router();

const PostsControllers = require('../controllers/posts');
// const { getPosts, createPost } = require('../controllers/posts');

/* GET home page. */
// router.get('/', function(req, res, next) {
//     res.render('index', { title: 'Express' });
// });

// router.get('/posts', function(req, res, next) {
//     PostsControllers.getPosts({ req, res });
// });
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
