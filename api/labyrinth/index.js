'use strict';

let express = require('express'),
	router = express.Router(),
	authFunctions = require(__base + 'functions/auth.functions.js'),
	labyrinthController = require(__base + 'api/labyrinth/labyrinth.controller.js');
router.get('/', authFunctions.isUser, labyrinthController.getAllLabyrinths);
router.post('/', authFunctions.isUser, labyrinthController.createNewLabyrinth);
router.get('/:id', authFunctions.isUser, labyrinthController.getLabyrinthById);
router.get('/:id/solution', authFunctions.isUser, labyrinthController.getSolutionById);
router.post('/:id/playfield/:x/:y/:type', authFunctions.isUser, labyrinthController.pushNewBlockToPlayfield);
router.post('/:id/:positionType/:x/:y',authFunctions.isUser, labyrinthController.pushPositionToBlock);

module.exports = router;