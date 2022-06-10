const express = require('express');
const router = express.Router();
const handleErrorAsync = require('../service/handleErrorAsync');
const upload = require('../service/image');
const { isAuth } = require('../service/auth');
const UploadControllers = require('../controllers/upload');

router.post('/', isAuth, upload, handleErrorAsync(UploadControllers.upload));

module.exports = router;