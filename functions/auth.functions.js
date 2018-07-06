'use strict';

let userDbHelper = require(__base + 'db/user.dbhelpers.js');

exports.isUser = (req, res, next) => {
	let userId = req.headers['user-id'];
	if(userId && userId.length === 24) {
		userDbHelper.getUserById(userId, (err, users) => {
			if(err) {
				console.log(err);
				res.send({type: 'Error', errMsg: 'DB Error'});
			}
			else {
				if(users.length === 0 ){ 
					res.send({type: 'Error', errMsg: 'No user found with user id'});
				}
				else {
					req.user = {
						id: userId,
						name: users[0].name
					};
					next();
				}
			}
		});
	}
	else {
		res.send({type: 'Error', errMsg: 'Invalid user id'});
	}
};