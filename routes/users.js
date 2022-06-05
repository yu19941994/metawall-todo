const express = require('express');
const router = express.Router();
const User = require('../model/user');
const handleErrorAsync = require('../service/handleErrorAsync');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

module.exports = router;
