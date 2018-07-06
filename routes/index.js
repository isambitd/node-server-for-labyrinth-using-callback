let express = require('express'),
	router = express.Router(),
	user = require(__base + 'api/user'),
	labyrinth = require(__base + 'api/labyrinth'),
	loggerFunction =  require(__base + 'functions/logger.functions.js');

router.use('*', loggerFunction.logReq);
router.use('/user', user);
router.use('/labyrinth', labyrinth);

module.exports = router;
