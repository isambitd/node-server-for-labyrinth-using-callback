'use strict';

let winston = require('winston'),
	userDbHelper = require(__base + 'db/user.dbhelpers.js'),
	userFunctions = require(__base + 'functions/user.functions.js'),
	userReqValidator = require(__base + 'validators/user'),
	createNew = (req, res, next) => {
		console.log(req.body);
		let reqData = req.body,
			type = 'Error',
			response = {}; 
		userReqValidator.validateCreateReq(reqData, (err) => {
			if(err) {
				winston.error(err);
				res.send({type: type, response: err});
			}
			else {
				userDbHelper.getUsersByName(reqData.name, (err, users) => {
					if(err) {
						winston.error(err);
						res.send({type: type, err: err, errMsg: 'DB Error'});		
					}
					else {
						if(users.length > 0) {
							winston.warn('User already present with name ' + reqData.name);
							res.send({type: type, errMsg: 'User already present with name ' + reqData.name});
						}
						else {
							userDbHelper.createUser(reqData.name, reqData.pw, (err, id) => {
								if(err) {
									winston.error(err);
									res.send({type: type, err: err, errMsg: 'DB Error'});		
								}
								else {
									res.send({type: 'Success', msg: 'New user created for ' + reqData.name, response: {id: id}});
								}
							});
						}
					}
				});		
			}
		});
	},
	login = (req, res, next) => {
		console.log(req.body);
		let reqData = req.body,
			type = 'Error',
			response = {}; 
		userReqValidator.validateCreateReq(reqData, (err) => {
			if(err) {
				winston.error(err);
				res.send({type: type, response: err});
			}
			else {
				userDbHelper.getUsersByNameAndPw(reqData.name, reqData.pw, (err, users) => {
					if(err) {
						winston.error(err);
						res.send({type: type, err: err, errMsg: 'DB Error'});		
					}
					else {
						if(users.length === 0) {
							winston.warn('User not preset in the DB - ' + reqData.name);
							res.send({type: type, errMsg: 'User not preset in the name of ' + reqData.name});
						}
						else {
							winston.info('Logged in successfully with name ' + reqData.name);
							res.send({type: 'Success', msg: 'Logged in successfully', response: {id: users[0]._id}});
						}
					}
				});		
			}
		});
	},
	getAllUsers = (req, res, next) => {
		let type = 'Error',
			response = {}; 
		userDbHelper.getAllUsers((err, users) => {
			if(err) {
				winston.error(err);
				res.send({type: type, err: err, errMsg: 'DB Error'});		
			}
			else {
				users = users.map(function(x){return {id: x._id, name: x.name}});
				winston.info('Fetched all users successfully');
				res.send({type: 'Success', msg: 'Fetched all users successfully', response: {users: users}});
			}
		});
	};

exports.createNew = createNew;
exports.login = login;
exports.getAllUsers = getAllUsers;