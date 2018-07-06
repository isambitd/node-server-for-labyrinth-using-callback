'use strict';

let winston = require('winston'),
	labyrinthFunctions = require(__base + 'functions/labyrinth.functions.js'),
	labyrinthDbHelpers = require(__base + 'db/labyrinth.dbhelpers.js'),
	labyrinthReqValidator = require( __base + 'validators/labyrinth'),
	getAllLabyrinths = (req, res, next) => {
		let status = "Error",
			response = {},
			userId = req.user.id;
		labyrinthDbHelpers.getAllLabyrinths(userId, (err, labyrinths) => {
			if(err) {
				winston.error(err);
				res.send({type: type, errMsg: "Error while retrieving labyrinths"});
			}
			else {
				labyrinths = labyrinths.map(function(x){return x._id});
				winston.info('Fetched all the labyrinths successfully');
				res.send({type: 'Success', msg: 'Fetched all the labyrinths successfully', response: {labyrinths: labyrinths}});
			}
		});
	},
	createNewLabyrinth = (req, res, next) => {
		let reqData = req.body,
			dimension = req.body.dimension ? reqData.dimension : {r: 8, c:8},
			userId = req.user.id,
			labyrinthData = {
				owner: userId,
				playfield: [],
				start: {},
				end: {},
				dimension: dimension
			},
			type = 'Error',
			response = {};
		labyrinthDbHelpers.createLabyrinth
		(labyrinthData, (err, id) => {
			if(err) {
				winston.error(err);
				res.send({type: type, errMsg: 'Error while create new Labyrinth'});
			}
			else {
				winston.info('Created new Labyrinth successfully. Id: '+ id);
				res.send({type: 'Success', msg: 'Created new Labyrinth successfully.', response: { id: id}});
			}
		});
	},
	getLabyrinthById = (req, res, next) => {
		let type = 'Error';
		labyrinthReqValidator.validateLabyrinthId(req.params, (err) => {
			if(err) {
				winston.error(err.errMsg);
				res.send({type: type, errMsg: err.errMsg});
			}
			else {
				labyrinthDbHelpers.getLabyrinthById(req.params.id, req.user.id, (err, labyrinth) => {
					if(err) {
						winston.error(err);
						res.send({type: type, errMsg: 'Error while retrieving labyrinthfrom DB'});
					}
					else {
						winston.info('successfully retrieved labyrinth data by Id');
						res.send({type: 'Success', response: labyrinth});
					}
				});
			}
		});
	},
	getSolutionById = (req, res, next) => {
		let type = 'Error';
		labyrinthReqValidator.validateLabyrinthId(req.params, (err) => {
			if(err) {
				winston.error(err.errMsg);
				res.send({type: type, errMsg: err.errMsg});
			}
			else {
				labyrinthDbHelpers.getLabyrinthById(req.params.id, req.user.id, (err, labyrinth) => {
					if(err) {
						winston.error(err);
						res.send({type: type, errMsg: 'Error while retrieving labyrinthfrom DB'});
					}
					else {
						let playfield = labyrinth.playfield,
							blockCache = {}, touchedBlocks = {};
						playfield.forEach(function(block) {
							if(block.type === 'block') {
								blockCache[block.x+'-'+ block.y] = true;
							}
						});
						var bestSolution = labyrinth.dimension.r * labyrinth.dimension.c; 
						let getSolution = (solution, currentPos, end, touchedBlocks, blockedBlocks, dimension) => {
							if(currentPos.x >= 0 && currentPos.y >= 0 && currentPos.x < dimension.r && currentPos.y < dimension.c && touchedBlocks.indexOf(currentPos.x + '-' + currentPos.y) === -1 && !blockedBlocks[currentPos.x + '-' + currentPos.y]) {
								let nextPositions = [{ x: currentPos.x , y: currentPos.y + 1},
												{x: currentPos.x, y: currentPos.y -1 },
												{x: currentPos.x - 1, y: currentPos.y},
												{x: currentPos.x + 1, y: currentPos.y}];
								solution.push(currentPos.x + '-' + currentPos.y);
								if(currentPos.x === end.x && currentPos.y === end.y) {
									if(touchedBlocks.length + 1 < bestSolution) {
										bestSolution = touchedBlocks.length + 1;
									}
									return solution;
								}
								else {
									let tempSolution = null, tempTouchedBlocks = [];
									for(let i in touchedBlocks) {
										tempTouchedBlocks.push(touchedBlocks[i]);
									}
									tempTouchedBlocks.push(currentPos.x + '-' + currentPos.y);
									if(bestSolution > tempTouchedBlocks.length + Math.abs(end.y - currentPos.y) + Math.abs(end.x - currentPos.x)){
										for(let i in nextPositions) {
											let returnVal = getSolution([], nextPositions[i], end, tempTouchedBlocks, blockedBlocks, dimension);
											if(returnVal && returnVal.length) {
												if(tempSolution && tempSolution.length) {
													if(tempSolution.length > returnVal.length) {
														tempSolution = returnVal;
													}
												}
												else {
													tempSolution = returnVal;
												}
											}
										}
									}
									if(tempSolution) {
										for(let i in solution) {
											tempSolution.unshift(solution[i]);
										}
										return tempSolution;
									}
									else {
										return null;
									}
								}
							}
							else {
								return null;
							}
						}
						let solution = getSolution([], labyrinth.start, labyrinth.end, [], blockCache, labyrinth.dimension),
							direction = [];
						for(let i=1;i<solution.length; i++) {
							let firstOne = solution[i-1].split('-').map(Number), secondOne = solution[i].split('-').map(Number);
							if(firstOne[0] === secondOne[0]) {
								if(firstOne[1] > secondOne[1]) {
									direction.push('left');
								}
								else{
									direction.push('right');
								}
							}
							else {
								if(firstOne[0] > secondOne[0]) {
									direction.push('top');
								}
								else{
									direction.push('bottom');
								}
							}
						}
						res.send({type: 'Success', response: { direction: direction, path: solution.map((x) => {let y = x.split('-').map(Number); return {x: y[0], y: y[1]}})}});
					}
				});
			}
		});
	},
	pushNewBlockToPlayfield = (req, res, next) => {
		let type = 'Error';
		labyrinthReqValidator.validateBlockType(req.params, (err) => {
			if(err) {
				winston.error(err.errMsg);
				res.send({type: type, errMsg: err.errMsg});
			}
			else {
				let blockDetails = {
					x: Number(req.params.x),
					y: Number(req.params.y),
					type: req.params.type
				};
				labyrinthDbHelpers.setBlockType(req.params.id, blockDetails, req.user.id, (err) => {
					if(err) {
						winston.error(err);
						res.send({type: type, errMsg: 'Error while updating new block'});
					}
					else {
						res.send({type: 'Success', msg: 'New block type updated successfully'});
					}
				});
			}
		});
	},
	pushPositionToBlock = (req, res, next) => {
		let type = 'Error';
		labyrinthReqValidator.validatePositionType(req.params, (err) => {
			if(err) {
				winston.error(err.errMsg);
				res.send({type: type, errMsg: err.errMsg});
			}
			else {
				labyrinthDbHelpers.setPositionType(req.params, req.user.id, (err) => {
					if(err) {
						winston.error(err);
						res.send({type: type, errMsg: 'Error while updating ' + req.params.positionType});
					}
					else {
						res.send({type: 'Success', msg: req.params.positionType + ' updated successfully'});
					}

				});
			}
		});
	};

exports.getAllLabyrinths = getAllLabyrinths;
exports.createNewLabyrinth = createNewLabyrinth;
exports.getLabyrinthById = getLabyrinthById;
exports.getSolutionById = getSolutionById;
exports.pushNewBlockToPlayfield = pushNewBlockToPlayfield;
exports.pushPositionToBlock = pushPositionToBlock;