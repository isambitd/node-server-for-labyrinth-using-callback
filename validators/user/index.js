let validateCreateReq = (reqData, callback) => {
	if (!reqData.name) {
		callback({errMsg: 'name can\'t be empty'});
	} 
	else if(typeof reqData.name !== 'string') {
		callback ({errMsg: 'name should be a string'});
	}
	else if( reqData.name.length > 20){
		callback ({errMsg: 'name can\'t be more than 20 chars'});
	}
	else if (!reqData.pw) {
		callback({errMsg: 'password can\'t be empty'});
	} 
	else if(typeof reqData.pw !== 'string') {
		callback ({errMsg: 'password should be a string'});
	}
	else if( reqData.pw.length > 20){
		callback ({errMsg: 'password can\'t be more than 20 chars'});
	}
	else {
		callback(null);
	}
};
exports.validateCreateReq = validateCreateReq;