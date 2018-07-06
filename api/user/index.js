'use strict';

var express = require('express'),
	userController = require(__base + 'api/user/user.controller.js');

var router = express.Router();
router.post('/create', userController.createNew);
router.post('/login', userController.login);
router.get('/all', userController.getAllUsers);

module.exports = router;
