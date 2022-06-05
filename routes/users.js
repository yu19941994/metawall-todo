const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function(req, res, next) {
    // res.send('respond with a resource');
    res.status(200).json({
        "name": "使用者"
    })
});

router.get('/login', function(req, res, next) {
    // res.send('respond with a resource');
    res.status(200).json({
        "name": "使用者"
    })
});

module.exports = router;
